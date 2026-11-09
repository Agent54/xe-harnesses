# LibreChat

A chat interface for multiple model providers.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Includes MongoDB. Optional search, RAG/vector database, and admin-panel services are absent.

Upstream pin: [0.8.9-rc1](https://github.com/danny-avila/LibreChat/releases/tag/v0.8.9-rc1) (preview). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
