## Project Idea

Working title: **FastyGo Slice Academy** or **UI8Kit Playground**.

This is an educational playground where users learn to build real interfaces through vertical slices: from a screenshot or assignment to a finished screen in `templ`, React TS, and HTML. The main value is not simply “browsing components,” but understanding the FastyGo stack through practice: components, props, design tokens, VSA, Go SSR, and React CSR.

## Core Unit

The basic unit of the project: **learning vertical slice**.

One slice contains:

- source stimulus: screenshot, mockup, dashboard, website, text assignment;
- recognized interface structure: blocks, components, layout, states;
- selected component set from `github.com/fastygo/templ`;
- design tokens and a skin similar in color and style;
- finished versions: `templ`, React TS, HTML;
- specification of props, variants, slots, data;
- assignments of varying difficulty;
- result verification;
- explanations and hints.

In other words, a slice becomes not just a UI example, but a full-fledged learning “lesson sandbox.”

## Main Spaces

### 1. Slice Workspace

This is the central place for one course or thread. The user sees one specific UI scenario and all related materials.

The workspace includes:

- preview of the source screenshot;
- reconstructed screen structure;
- list of similar blocks and components found;
- selected skin/design tokens;
- code versions: `templ`, React TS, HTML;
- assignments;
- progress;
- explanations;
- attempt history.

The workspace answers the question: “What do you need to assemble exactly this screen?”

### 2. Component Catalog

This is the layer for getting familiar with `Templ` and UI8Kit.

It shows not an abstract component library, but components in the context of real slices:

- where `Button`, `Card`, `Sheet`, `Nav`, `Badge`, `Form` are used;
- which props control appearance;
- which variants exist;
- how Go/templ notation differs from React TS;
- how one component contract is expressed in two runtimes.

Important: the catalog should not be a reference for its own sake, but an “anatomy of interfaces.”

### 3. Skin Gallery

This is a design token library, similar in role to `tweakcn.css`.

The user can see:

- similar color themes;
- light/dark variants;
- radii, shadows, typography;
- similarity to the source screenshot;
- how the same slice looks in different skins.

This makes learning visual: component logic stays the same, styling changes through tokens.

### 4. Tutorial / Player

This is the mode for completing assignments.

It can work as an interactive tutorial:

- open the finished React version and ask the user to write `templ`;
- open the Go/templ version and ask the user to write React;
- show only props/spec and ask the user to assemble the UI;
- hide part of the code and ask the user to restore it;
- proceed step by step with an LLM mentor;
- pause at each piece of code and explain the syntax.

This is the main onboarding tool.

### 5. Competitive Arena

This is the gamification layer.

Here several participants solve assignments and earn points for:

- speed;
- visual match accuracy;
- component correctness;
- clean props;
- understanding of VSA;
- completing without hints;
- translation between React and templ;
- solving difficult slices.

The arena can grow into selection rounds, rankings, team battles, and full-fledged courses.

## MVP Modes

For the first version, a few modes are enough:

1. **Download Ready Slice**  
   The user receives finished `templ`, React, and HTML versions to simply study the structure.

2. **React → Templ**  
   React code is open; the user writes the Go/templ version. Goal: understand templ syntax and the SSR approach.

3. **Templ → React**  
   Go/templ code is open; the user writes React TS. Goal: understand the dual-stack mental model.

4. **Spec → UI**  
   The user sees only the component description, props, and expected preview. They need to assemble the interface.

5. **LLM Guided Mode**  
   The LLM walks through the code in small steps: explains a block, asks a question, waits for an answer, opens the next piece.

6. **Challenge Mode**  
   Minimum hints, maximum independence, points and leaderboard.

## Project Entities

Key entities can be represented as follows:

- **Course / Thread** — one learning flow around a topic or screenshot.
- **Slice** — one vertical UI slice.
- **Screenshot / Source** — input material.
- **Recognition Result** — recognized blocks, text, layout, colors.
- **Component Match** — link between a found UI block and `Templ` components.
- **Skin** — a set of design tokens.
- **Target Runtime** — `templ`, React TS, HTML.
- **Lesson** — learning sequence.
- **Task** — specific exercise.
- **Attempt** — user attempt.
- **Feedback** — verification, hint, explanation.
- **Score** — points, progress, ranking.

## How This Relates to Current Repositories

`Templ` — source of the component library and dual-stack contract. Components, specs, variants, data, and rules for correspondence between Go/templ and React live there.

`Blank` — a good foundation for the learning playground: a consumer application where you can assemble vertical slices, connect styles, tokens, pages, workspaces, and learning scenarios.

`Blank/web/static/css/tweakcn.css` — example of the skins/design tokens layer. In the future this could become a large collection of themes.

`Templ/examples/ui/blocks/dashboard` — example of what the result should look like: not a single component, but an assembled block/screen.

`vertical_slice_architecture.md` — product philosophy: one course/thread = one slice, with everything needed for the result nearby.

## Main Structural Formula

The project can be thought of as:

```text
Screenshot or Task
  -> Recognition
  -> Component Matching
  -> Skin Selection
  -> Vertical Slice Package
  -> Learning Modes
  -> Attempts and Feedback
  -> Score and Progress
```

From the user's perspective:

```text
Chose a screen
  -> received a ready slice
  -> studied the components
  -> rewrote between React and templ
  -> got feedback
  -> leveled up the skill
  -> moved on to a more difficult slice
```

## Final Positioning

This is not just a playground and not just docs. It is a **gamified vertical UI slice tutorial for FastyGo**, where real interfaces become assignments, components are learned through practice, and `templ` and React are explained as two syntaxes of one design contract.
