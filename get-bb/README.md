# bb behind a proxy

Open [https://bb_harness-get-bb.app.localhost](https://bb_harness-get-bb.app.localhost), or set `PUBLIC_URL` in `.env` to another external origin. Compose supplies both supported settings: `BB_APP_URL` controls generated links, allowed browser origins, and accepted DNS hostnames; `BB_EXTERNAL_URL` supplies the public HTTPS base for external links.

Preserve the external `Host` and forward HTTPS/proxy headers and WebSocket upgrades. bb [requires a configured app URL for a custom DNS name](https://github.com/get-bb/bb/blob/desktop-v0.48.1/docs/configuration.md); matching `Host` and `Origin` alone do not authorize an otherwise unconfigured domain. The internal listener remains `0.0.0.0:38886`.

This does not replace bb's authentication model: the locally deployed public API can execute commands and read container files, so retain the loopback-only published port and your local proxy boundary. Provider OAuth has independent redirect rules. The included Codex can use `docker compose exec bb codex login --device-auth` without a callback to browser-local localhost.

There are no mounts, and every process runs as the non-root service user. Removing or recreating the container removes its state.

## Version and entry point

Pin: [0.48.1](https://github.com/get-bb/bb/releases/tag/desktop-v0.48.1). Entry: [HTTPS app](https://bb_harness-get-bb.app.localhost) · [direct:38886](http://localhost:38886).

See [versions.json](../versions.json) for source verification dates.

The image includes the pinned Codex provider; add other provider CLIs in its Dockerfile.
