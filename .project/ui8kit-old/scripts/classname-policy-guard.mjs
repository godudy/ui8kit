import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'

/**
 * className Policy Guard (variants-only enforcement)
 *
 * Strict rule:
 * - In configured component directories, JSX `className` must not contain
 *   any string/template literals (no inline utility classes).
 *
 * Examples that FAIL:
 * - className="flex"
 * - className={cn('flex flex-col', className)}
 * - className={condition ? 'p-4' : 'p-2'}
 * - className={cn({ 'border': variant === 'default' })}
 *
 * Examples that PASS:
 * - className={cn(spacingVariants({ p }), roundedVariants({ rounded }), className)}
 * - className={className}
 *
 * Default mode checks only changed files (git diff).
 * Use --all to scan all files under the target directories.
 *
 * Target directories:
 * - Default: src/components/ui/
 * - Override with env: CLASSNAME_POLICY_DIRS="src/components/ui,src/other/dir"
 * - Override with args: --dir src/components/ui --dir src/other/dir
 */

const repoRoot = process.cwd()
const traverse = traverseModule?.default ?? traverseModule

function parseTargetDirs(argv) {
  // 1) CLI args (--dir ...)
  const dirs = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dir' && argv[i + 1]) {
      dirs.push(argv[i + 1])
      i++
    }
  }
  if (dirs.length > 0) return dirs

  // 2) Env var
  const env = process.env.CLASSNAME_POLICY_DIRS
  if (env && env.trim().length > 0) {
    return env
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  // 3) Default (UI components only)
  return ['src/components/ui']
}

function normalize(p) {
  return p.replaceAll('\\', '/')
}

const rawArgs = process.argv.slice(2)
const targetDirs = parseTargetDirs(rawArgs).map(normalize).map((d) => d.replace(/\/+$/, ''))

function isTargetFile(file) {
  const f = normalize(file)
  const inDir = targetDirs.some((d) => f === d || f.startsWith(`${d}/`))
  return inDir && (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.endsWith('/index.ts')
}

function readChangedFiles() {
  const out = execSync('git diff --name-only --diff-filter=ACMRT', { encoding: 'utf8' }).trim()
  const files = out ? out.split(/\r?\n/) : []
  return files.map(normalize).filter(isTargetFile)
}

function walkDir(dirAbs, out) {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true })
  for (const e of entries) {
    const abs = path.join(dirAbs, e.name)
    if (e.isDirectory()) walkDir(abs, out)
    else out.push(abs)
  }
}

function readAllComponentFiles() {
  const absFiles = []
  for (const dir of targetDirs) {
    const absRoot = path.join(repoRoot, dir)
    if (!fs.existsSync(absRoot)) continue
    walkDir(absRoot, absFiles)
  }
  return absFiles.map((p) => normalize(path.relative(repoRoot, p))).filter(isTargetFile)
}

function getLine(source, line) {
  const lines = source.split(/\r?\n/)
  return lines[line - 1] ?? ''
}

function analyzeFile(relPath) {
  const abs = path.resolve(repoRoot, relPath)
  const source = fs.readFileSync(abs, 'utf8')

  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
    sourceFilename: abs,
    errorRecovery: false,
  })

  const violations = []

  function report(node, message) {
    const loc = node.loc?.start
    const line = loc?.line ?? 0
    const column = loc?.column ?? 0
    const codeLine = line ? getLine(source, line).trim() : ''
    violations.push({
      relPath,
      line,
      column,
      message,
      codeLine,
    })
  }

  traverse(ast, {
    JSXAttribute(attrPath) {
      const n = attrPath.node
      if (n.name?.type !== 'JSXIdentifier') return
      if (n.name.name !== 'className') return

      if (!n.value) {
        report(n, 'className must not be used without a value.')
        return
      }

      if (n.value.type === 'StringLiteral') {
        report(n.value, 'Inline className string literals are not allowed in src/components/**.')
        return
      }

      if (n.value.type !== 'JSXExpressionContainer') {
        // Rare case: JSXElement/Fragment etc. Treat as violation to keep policy strict.
        report(n.value, 'Unsupported className value. Use variant functions + cn(...) only.')
        return
      }

      // Strict: any StringLiteral or TemplateLiteral inside the expression is a violation.
      attrPath.traverse({
        StringLiteral(p) {
          // Allow string literals inside variant function calls, e.g. spacingVariants({ p: 'md' }).
          // These are variant tokens, not inline Tailwind class strings.
          let cur = p
          let isAllowed = false
          while (cur) {
            const node = cur.node
            if (node?.type === 'CallExpression') {
              const callee = node.callee
              const name =
                callee?.type === 'Identifier'
                  ? callee.name
                  : callee?.type === 'MemberExpression' && callee.property?.type === 'Identifier'
                    ? callee.property.name
                    : null
              if (name && name.endsWith('Variants')) {
                isAllowed = true
                break
              }
            }
            cur = cur.parentPath
          }

          if (!isAllowed) {
            report(p.node, 'Inline class strings are not allowed in className (move them to src/variants/**).')
            p.stop()
          }
        },
        TemplateLiteral(p) {
          // Template literals are forbidden unless they are used inside variant calls.
          let cur = p
          let isAllowed = false
          while (cur) {
            const node = cur.node
            if (node?.type === 'CallExpression') {
              const callee = node.callee
              const name =
                callee?.type === 'Identifier'
                  ? callee.name
                  : callee?.type === 'MemberExpression' && callee.property?.type === 'Identifier'
                    ? callee.property.name
                    : null
              if (name && name.endsWith('Variants')) {
                isAllowed = true
                break
              }
            }
            cur = cur.parentPath
          }

          if (!isAllowed) {
            report(p.node, 'Inline template literals are not allowed in className (move them to src/variants/**).')
            p.stop()
          }
        },
      })
    },
  })

  return violations
}

const args = new Set(rawArgs)
const files = args.has('--all') ? readAllComponentFiles() : readChangedFiles()

if (files.length === 0) process.exit(0)

const allViolations = []
for (const f of files) {
  allViolations.push(...analyzeFile(f))
}

if (allViolations.length > 0) {
  const formatted = allViolations
    .map((v) => {
      const loc = v.line ? `${v.line}:${v.column}` : ''
      return `- ${v.relPath}${loc ? `:${loc}` : ''}\n  - ${v.message}\n  - ${v.codeLine}`
    })
    .join('\n')

  throw new Error(
    `className policy violations found:\n${formatted}\n\n` +
      `Fix: move inline classes to src/variants/** and compose via cn(variantFn(...), className).`
  )
}

console.log(`✅ className policy guard passed for changed components:\n- ${files.join('\n- ')}`)


