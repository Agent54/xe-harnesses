# Cloudflare OS

An AI workspace running the upstream local development runtime.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agents` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Uses Wrangler/workerd. A pinned source patch maps gatekeeper URLs to the Xe-provided public origin. This is not the upstream production deployment.

Upstream pin: [a3ba4746b58f1ef8e2252f8bac6b6377099202f0](https://github.com/cloudflare/cloudflare-os/commit/a3ba4746b58f1ef8e2252f8bac6b6377099202f0). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
