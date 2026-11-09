# OpenChamber

A browser workspace for coding agents.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Uses upstream UI password authentication and request-origin checks.

Upstream pin: [2.6.1](https://github.com/openchamber/openchamber/releases/tag/v2.6.1). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
