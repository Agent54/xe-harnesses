# OpenWork

A self-hosted agent workspace with a web interface.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Uses separate client and host tokens. The launcher downloads its release-tested OpenCode engine at first startup. The Electron shell and Den control plane are absent; upstream web mode retains automatic approval.

Upstream pin: [0.18.64](https://github.com/different-ai/openwork/releases/tag/v0.18.64). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
