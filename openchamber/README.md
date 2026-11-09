# OpenChamber behind a proxy

The default public address is [https://openchamber_harness-openchamber.app.localhost](https://openchamber_harness-openchamber.app.localhost). Set `PUBLIC_URL` in `.env` to change it. Compose supplies it as the upstream `OPENCHAMBER_LAN_URL`, which [advertises the reachable address instead of the container's bridge IP](https://github.com/openchamber/openchamber/blob/v2.6.1/packages/web/server/lib/security/bind-host.js).

Preserve the external `Host`, set `X-Forwarded-Host` and `X-Forwarded-Proto: https`, and forward WebSocket upgrades. The upstream [request-origin checks](https://github.com/openchamber/openchamber/blob/v2.6.1/packages/web/server/lib/security/request-security.js) accept the matching request or forwarded host. Configure `OPENCHAMBER_UI_PASSWORD` before starting the stack. The service still listens on `0.0.0.0:3000` internally.

This address configuration does not override an OAuth provider's registered loopback redirect. Choose device-code authentication where offered, or use an API key when operating without a reachable callback listener. There are no mounts; state is lost on recreation.

## Version and entry point

Pin: [2.6.1](https://github.com/openchamber/openchamber/releases/tag/v2.6.1). Entry: [HTTPS app](https://openchamber_harness-openchamber.app.localhost) · [direct:3000](http://localhost:3000).

See [versions.json](../versions.json) for source verification dates.

set the UI password or bearer token from `.env.example`. Qwen's browser connection screen accepts `QWEN_SERVER_TOKEN`. Paseo and bb include the pinned Codex provider; other provider CLIs can be added in their Dockerfiles.
