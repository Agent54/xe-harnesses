# Pi Durable

A durable coding-agent runtime exposed through an HTTP API.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

A small custom host wraps the upstream library with coding tools and a Node execution environment. Provides one shared conversation, bearer-authenticated submissions, and SQLite checkpoints. There is no browser UI; health checks are unauthenticated.

Upstream pin: [1.5.0](https://github.com/earendil-works/pi/releases/tag/v1.5.0) (experimental). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
