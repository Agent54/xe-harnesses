# bb

A coding workspace with a browser interface.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agents` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Includes Codex. The upstream public API can execute commands and access container files.

Upstream pin: [0.48.1](https://github.com/get-bb/bb/releases/tag/desktop-v0.48.1). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
