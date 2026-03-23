# CLAUDE.md — Skeleton Frontend

Next.js 15 SPA consuming the Laravel API. Read `ARCHITECTURE.md` for full design decisions and reference implementation.

**Priority:** Root CLAUDE.md > This file > ARCHITECTURE.md > Superpowers skills > Third-party > Default

## Context Loading Rule

ALWAYS read these files from disk before ANY frontend task (even if read earlier — they may have changed):
1. `frontend/ARCHITECTURE.md` — **This is law.** Every file you create or modify MUST follow its patterns exactly.
2. `frontend/DESIGN_SYSTEM.md` (if exists)
3. `frontend/CLAUDE.md`

## Design System

If `DESIGN_SYSTEM.md` exists, it is the SINGLE SOURCE OF TRUTH for all visual decisions.
- NEVER hardcode colors — use Tailwind classes from design system
- NEVER hardcode spacing — use design system spacing scale
- NEVER invent component variants — use what's defined
- If design system doesn't cover something, ASK before proceeding
- New shared components MUST have Storybook stories

If `DESIGN_SYSTEM.md` does NOT exist, use shadcn/ui defaults without customization. The result will be functional but visually neutral. Suggest creating DESIGN_SYSTEM.md as a follow-up (use `design-system-extractor` skill if `/design` folder exists).

## Development Workflow (Superpowers Integration)

This project uses Superpowers for the development process. The workflow is: brainstorm → plan → implement (TDD) → validate → finish.

### During Brainstorming

When Superpowers `brainstorming` activates for frontend work, inject these constraints:

- Read `frontend/ARCHITECTURE.md` before proposing any design — it has the reference implementation for every file type.
- Read `frontend/DESIGN_SYSTEM.md` if it exists. All visual decisions flow from this file.
- New modules MUST be scaffolded with `make-module.ts`. Never create module files manually.
- Base module = 12 files (see ARCHITECTURE.md). Only add Extension Points when explicitly triggered.
- List which existing design system components will be reused.
- List which NEW components need creation (these need `.stories.tsx`).
- Specify exact module structure: files in `modules/{mod}/` and pages in `app/`.

**Standard CRUD fast-track:** If the feature is a standard CRUD (list + create + edit, no complex business logic), propose the design in one pass: entity fields, permissions, which existing components to reuse, and confirm.

**Cross-module business rule changes:** If the backend change modifies a shared business rule that affects frontend modules (new UI flows, changed data shapes, new selectors), the backend Impact Map (see `backend/ARCHITECTURE.md` → "Impact Analysis") will include a "New UI requirements" section. Use it to plan frontend tasks.

**Preview before implementing:** For significant UI work (new pages, redesigns, complex layouts), suggest using `skeleton:previewing` to generate an HTML prototype before implementing in React. This saves rework from rejected layouts.

### During Planning

When Superpowers `writing-plans` activates:

- Backend tasks BEFORE frontend tasks for full-stack features.
- **Type generation bridge:** After the last backend task that changes Controllers or FormRequests, add: `cd frontend && npm run generate:types && npm run typecheck`. This ensures frontend starts with correct types.
- First task for a new frontend module = run `make-module.ts` generator.
- Each implementation task follows RED → GREEN → REFACTOR → GUARD → COMMIT.

### During Implementation (TDD)

When Superpowers `test-driven-development` activates, follow these stack-specific patterns:

- **Test location:** `modules/{mod}/__tests__/{mod}.test.ts` (single file per module)
- **Test structure:** `describe()` blocks for hooks, components, forms
- **Framework:** Vitest + Testing Library + MSW. NEVER `vi.mock`.
- **Run tests:** `cd frontend && npm run test -- --run {test-file}`
- See ARCHITECTURE.md → "File Responsibilities" for reference implementation of every file type.
- See ARCHITECTURE.md → "Shared Infrastructure Contracts" for `httpClient`, `mapApiErrors`, `labels`, `permissions` signatures.

**If a prototype was approved:** Read the HTML file from `frontend/.previews/{feature}.html` as visual reference. The implemented version must match it visually.

### Validation Guards

Run after each task (task mode) and before finishing (final mode):

**Task mode (after each task):**

| Command | Pass criteria |
|---------|---------------|
| `npm run test -- --run {test-file}` | PASS |
| `npm run lint` | Exit 0 |
| `npm run typecheck` | Exit 0 |

**Design compliance (task + final):**

| Command | Pass criteria |
|---------|---------------|
| `grep -rn "bg-\[#\|text-\[#\|border-\[#" modules/ app/ --include="*.tsx"` | 0 results (no hardcoded colors) |
| `grep -rn "from.*modules/" modules/ --include="*.ts" --include="*.tsx" \| grep -v "__tests__\|from '\.\."` | 0 results (no cross-module imports) |

**Final mode (all tasks complete):**

| Command | Pass criteria |
|---------|---------------|
| `npm run test` | ALL PASS |
| `npm run lint` | Exit 0 |
| `npm run typecheck` | Exit 0 |
| `npm run build` | Exit 0 |
| `npx storybook build` | Exit 0 |

**Architecture checklist (final mode):**
- [ ] No cross-module imports (except `types.ts`)
- [ ] No barrel exports (no `index.ts` re-exports)
- [ ] `app/` has no business logic
- [ ] Data fetching via `api.*` only (no direct `fetch`)
- [ ] Query keys defined in `api.ts`, not in hooks
- [ ] Forms: Zod → RHF → shadcn → `mutateAsync` + `mapApiErrors`
- [ ] One form component for create AND edit (mode prop)
- [ ] Labels from `lib/labels.ts` (no hardcoded text)
- [ ] Env from `config/env.ts` (no `process.env`)
- [ ] UI states: LoadingState, EmptyState, ErrorState in every data-dependent view
- [ ] Filters and pagination synced with URL search params
- [ ] IDs and timestamps are `string`
- [ ] TypeScript strict, no `any`
- [ ] Every component has its `.stories.tsx`
- [ ] `types.ts` re-exports from `types/api.ts`, defines module-specific UI types

**Cross-project sync (full-stack final):**

| Step | Criteria |
|------|----------|
| `npm run generate:types` | Exit 0, `types/api.ts` updated |
| `npm run typecheck` after regenerating | Exit 0 |

## Project-Specific Skills

See root `CLAUDE.md` → "Project-Specific Skills" for `skeleton:previewing` and `design-system-extractor`.

## Commands

```bash
npm run dev              # Turbopack dev server
npm run build            # Production build
npm run lint             # ESLint + Prettier
npm run typecheck        # tsc --noEmit
npm run test             # Vitest
npm run generate:types   # Regenerate from OpenAPI spec
npm run storybook        # Storybook dev server on :6006
npm run build-storybook  # Static Storybook build
```

## Module Generator

```bash
npx tsx scripts/make-module.ts --name={module} --entity={Entity}
```

Generates 12 files (see `ARCHITECTURE.md` → "Base Module Structure"). Always use this as the first step for new modules. Customize TODOs with real fields after generation.

## Progressive Disclosure

Base module = 12 files. Add complexity ONLY when Extension Point triggers are met (see `ARCHITECTURE.md` → "Extension Points").

## UI Primitives: Base UI (NOT Radix)

This project uses **Base UI** (`@base-ui/react`) as the headless component library. shadcn/ui components are built on top of Base UI. **There is NO Radix in this project.**

Base UI is the successor to Radix (same team), but the API is different. Common pitfalls:

| Radix Pattern (DO NOT USE) | Base UI Pattern (USE THIS) |
|---|---|
| `asChild` prop | `render` prop: `render={<Link href="..." />}` |
| `onSelect` on menu items | `onClick` on menu items |
| `<Button asChild><Link>` | `<Button nativeButton={false} render={<Link />}>` |
| `onValueChange` returns `string` | `onValueChange` may return `string \| null` |

When using `<Button>` with a non-`<button>` element (like `<Link>`), you MUST pass `nativeButton={false}` to avoid the Base UI warning about native button semantics.

## Rules

**All patterns, conventions, and naming rules are defined in `ARCHITECTURE.md`.** Read it before creating or modifying any file. The rules below are operational supplements.

- **ARCHITECTURE.md is the source of truth.** No exceptions.
- **Files:** kebab-case. **Components:** PascalCase. **Hooks:** camelCase with `use` prefix.
- **TypeScript strict.** Never `any`. IDs = `string`. Timestamps = `string`.
- **Forms:** Zod schema → RHF `useForm` → shadcn `FormField` → `mutateAsync` + `mapApiErrors`. One form for create AND edit.
- **Labels:** `lib/labels.ts`. Never hardcode user-facing text.
- **No barrel exports.** No `index.ts` re-exports.
- **Modules don't cross-import** (except via `types.ts`).

## API Types

NEVER write API types manually. Always generated from backend via `npm run generate:types`. The file `types/api.ts` is read-only and git-ignored. Modules re-export what they need via their own `types.ts`.

## Error Handling

| Status | Action |
|--------|--------|
| 422 + fields | `mapApiErrors` → form fields via `setError` |
| 422 + business code | `toast.error(message)` |
| 401 | AuthGuard redirects |
| 403 | ErrorState "No permissions" |
| 404 | NotFoundState |
| 419 | CSRF retry (automatic in httpClient) |
| 500/network | Generic toast |