# Contributing to MiniAgent

## Branch model: GitHub Flow
- `main` is the single long-lived, protected branch.
- Every feature or fix starts from `main` as a branch named `feature/<short-slug>`
  or `fix/<short-slug>`.
- Work happens on the branch; merge back to `main` via a Pull Request.
- PRs require a passing CI run before merge.

## Commits: Conventional Commits
Format: `<type>(<scope>): <subject>`
Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`.
Example: `feat(agent): add streaming response for chat`

## Local setup
- Node.js + pnpm (frontend), Rust toolchain (backend, inside `src-tauri`).
- `pnpm install` then `pnpm tauri dev` to run the desktop app.
- See README.md for details.

## Before opening a PR
- Run lint and tests locally.
- Keep changes focused; one logical change per PR.
