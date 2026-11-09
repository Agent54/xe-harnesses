# TrueForge

Run `docker compose up --build -d` and open [the TrueForge domain](https://trueforge_harness-trueforge.app.localhost). Override `PUBLIC_URL` in `.env` to change the canonical browser origin. Compose translates it to the supported `PUBLIC_BASE_URL` setting used for OAuth/MCP callbacks and generated public paths. Internal controller calls and health probes remain on container loopback.

TrueForge 0.183.0 otherwise ignores `PUBLIC_BASE_URL` in standalone production mode and always returns `http://localhost:8790`. The small [public-origin.patch](public-origin.patch) changes that fallback to apply only when no public URL was configured. It patches the pinned npm bundle with `--fuzz=0`, retaining the existing single-process SQLite topology. A package-layout or code change will fail the build instead of silently leaving localhost callbacks.

Keep Host and WebSocket upgrades intact at the TLS proxy. Register external provider OAuth applications with redirect URIs under your configured public origin. No volumes or mounts are used; container recreation loses state. Image builds and provider/browser flows remain untested because Docker daemon access was declined.

Source: the pinned [effectivePublicBaseUrl implementation](https://github.com/truefoundry/trueforge/blob/%40truefoundry/trueforge%400.183.0/packages/trueforge/src/config.ts).

## Version and entry point

Pin: [0.183.0](https://github.com/truefoundry/trueforge/releases/tag/%40truefoundry/trueforge%400.183.0). Entry: [HTTPS app](https://trueforge_harness-trueforge.app.localhost) · [direct:8790](http://localhost:8790).

See [versions.json](../versions.json) for source verification dates.

uses upstream standalone mode (SQLite, one process); configure models and tools in its UI. Remote tools and hosted sandboxes work with their own credentials. A local Docker sandbox cannot use the host engine because its socket is not mounted.
