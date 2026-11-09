# TrueForge

An agent workspace with model and tool integrations.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Uses standalone SQLite mode. A pinned bundle patch honors the public origin. Local Docker sandboxes cannot access the host engine because its socket is absent.

Upstream pin: [0.183.0](https://github.com/truefoundry/trueforge/releases/tag/%40truefoundry/trueforge%400.183.0). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
