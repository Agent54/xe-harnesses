# T3 Code

A web workspace for coding agents, projects, terminals, and reviews.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Includes Codex, OpenCode, Pi, Git, GitHub CLI, SSH, Python, and ripgrep. Desktop-only integrations and host browser access are absent. Browser-facing URLs derive from request metadata.

Upstream pin: [0.1.7](https://github.com/pingdotgg/t3code/releases/tag/v0.1.7). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
