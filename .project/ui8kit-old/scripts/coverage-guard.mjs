import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Coverage Guard (TDD policy enforcement)
 *
 * Fails if a file under src/components/** or src/components/ui/** is changed
 * but does not have:
 * - a matching test file under tests/components/
 * - 100% coverage in coverage/coverage-summary.json
 *
 * Notes:
 * - This script is intentionally strict.
 * - It is meant to be run after: `vitest run --coverage`
 */

const repoRoot = process.cwd()
const coverageSummaryPath = path.join(repoRoot, 'coverage', 'coverage-summary.json')

function normalize(p) {
  return p.replaceAll('\\', '/')
}

function readChangedFiles() {
  // Use staged + unstaged changes (developer-friendly)
  // If repo is not a git repo, this will throw.
  const out = execSync('git diff --name-only --diff-filter=ACMRT', { encoding: 'utf8' }).trim()
  const files = out ? out.split(/\r?\n/) : []
  return files.map(normalize)
}

function isComponentFile(file) {
  return (
    file.startsWith('src/components/') &&
    (file.endsWith('.ts') || file.endsWith('.tsx')) &&
    !file.endsWith('/index.ts')
  )
}

function expectedTestPathForComponent(componentPath) {
  // src/components/ui/Button.tsx -> tests/components/Button.test.tsx
  // src/components/Card.tsx     -> tests/components/Card.test.tsx
  const base = path.basename(componentPath).replace(/\.(ts|tsx)$/, '')
  return normalize(path.join('tests', 'components', `${base}.test.tsx`))
}

function loadCoverageSummary() {
  if (!fs.existsSync(coverageSummaryPath)) {
    throw new Error(
      `Missing coverage summary: ${normalize(coverageSummaryPath)}\n` +
        `Run: bun run test:coverage`
    )
  }
  const raw = fs.readFileSync(coverageSummaryPath, 'utf8')
  return JSON.parse(raw)
}

function getCoverageEntry(summary, filePath) {
  // coverage-summary.json keys are absolute Windows paths in this repo.
  // We'll match by normalized suffix.
  const wantedSuffix = normalize(path.resolve(repoRoot, filePath))
  const keys = Object.keys(summary).filter((k) => k !== 'total')
  const hit = keys.find((k) => normalize(k) === wantedSuffix)
  return hit ? summary[hit] : null
}

function assert100(entry, filePath) {
  const metrics = ['lines', 'statements', 'functions', 'branches']
  for (const m of metrics) {
    const pct = entry?.[m]?.pct
    if (pct !== 100) {
      throw new Error(
        `Coverage must be 100% for ${filePath} (${m}=${pct}%).\n` +
          `Fix: add/adjust tests, then run: bun run test:coverage`
      )
    }
  }
}

const changed = readChangedFiles().filter(isComponentFile)

if (changed.length === 0) {
  process.exit(0)
}

const summary = loadCoverageSummary()

for (const componentFile of changed) {
  const testFile = expectedTestPathForComponent(componentFile)

  if (!fs.existsSync(path.join(repoRoot, testFile))) {
    throw new Error(
      `Missing test for changed component: ${componentFile}\n` +
        `Expected: ${testFile}\n` +
        `TDD policy: add the test first, then change the component.`
    )
  }

  const entry = getCoverageEntry(summary, componentFile)
  if (!entry) {
    throw new Error(
      `No coverage entry for changed component: ${componentFile}\n` +
        `Fix: ensure the component is imported by its test and re-run: bun run test:coverage`
    )
  }

  assert100(entry, componentFile)
}

console.log(`✅ Coverage guard passed for changed components:\n- ${changed.join('\n- ')}`)


