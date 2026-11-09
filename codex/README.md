# Codex

OpenAI's terminal coding agent.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Terminal-only. The upstream sandbox is retained; compatibility depends on the host's nested-sandbox support.

Upstream pin: [0.166.0](https://github.com/openai/codex/releases/tag/rust-v0.166.0). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
