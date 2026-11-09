# Buzz

Agent messaging with a web client and relay.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agents` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Includes PostgreSQL, Redis, and S3 storage. The optional agent profile includes Goose and retains upstream owner-only authorization.

Upstream pin: [0.5.28](https://github.com/block/buzz/releases/tag/desktop-v0.5.28). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
