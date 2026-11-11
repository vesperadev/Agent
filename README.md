# MiniAgent

A personal Agent built to learn how agents actually work — from a single chat
round-trip up to a tool-calling loop — packaged as a desktop app with Tauri.

## Stack
- **Frontend**: React + TypeScript (Vite)
- **Backend / Agent core**: Rust (Tauri v2), lives in `src-tauri/src`
- **Desktop shell**: Tauri v2

## Architecture (planned)
- React UI sends a message → Rust core assembles `messages` → calls the LLM API
  → streams the reply back.
- The "Agent" part (tools, multi-step loop) is built incrementally; the repo
  starts from the bare chat round-trip.

## Development
Prerequisites: Node.js, pnpm, Rust (with the Tauri CLI).

```bash
pnpm install
pnpm tauri dev
```

## Roadmap
1. One-shot chat round-trip (frontend ↔ Rust core ↔ LLM)
2. Multi-turn conversation memory
3. Streaming responses
4. Function calling (tools)
5. Agent loop (multi-step)
6. Failure handling

## License
[MIT](./LICENSE)
