# OpenWork

Copy `.env.example` to `.env`, generate two different tokens, then:

```sh
docker compose up --build -d
docker compose logs -f openwork
```

Open [https://openwork_harness-openwork.app.localhost](https://openwork_harness-openwork.app.localhost) and enter the **client token** (`OPENWORK_TOKEN`) when asked to connect. Set `PUBLIC_URL` in `.env` if the proxy serves another origin. The entrypoint derives OpenWork's native `OPENWORK_ALLOWED_HOSTS` and `OPENWORK_CORS_ORIGINS` from that URL, with no wildcard allowlist. Keep the original `Host` header when proxying. The separate `OPENWORK_HOST_TOKEN` stays on the server for host approvals. Automatic token injection into browser pages is disabled with the upstream `--no-bootstrap-token` flag. Keep both tokens private.

The container uses the published `openwork-server` npm package's `web` command, which serves the bundled UI and API on one origin and manages the OpenCode engine. Browser API/WebSocket connections follow the page's origin, including HTTPS, rather than a container-local advertised address. The proxy must forward WebSocket upgrades. It needs stable Node 24.22.1 or newer within the 24.x branch; Bun and Electron are not required. Configure a model/provider in the UI or supply the optional provider variables from `.env.example`. Provider OAuth clients may still require their registered loopback callback; changing the page's public URL cannot change a provider's permitted redirect URIs. Use a provider-supported device-code login or API key where needed.

On first startup, the upstream launcher downloads the exact engine version tested by this OpenWork release into `~/.openwork/openwork-server/engines/`. That startup needs outbound network access and can take longer than subsequent restarts. The engine is managed by OpenWork rather than replaced with the independently installed OpenCode 2 stack's version. `/health` exposes the pinned and installed engine versions.

The initial workspace is `/workspace`. The app, engine, credentials, tokens, history, and project files stay inside the non-root container. No volumes or mounts are declared or inherited. State survives a restart of the same container; removing or recreating it loses that state. Export work before an upgrade or recreation.

This runs the upstream self-hosted web surface. The Electron shell, native desktop integrations, and separate Den organization control plane are not included. Web mode retains upstream automatic approval because there is no desktop host approval responder; published access is restricted to host loopback and requires the client token.

Version evidence, checked 2026-11-04: latest stable [OpenWork v0.18.64](https://github.com/different-ai/openwork/releases/tag/v0.18.64), matching the published `openwork-server@0.18.64` package. The tagged [server guide](https://github.com/different-ai/openwork/blob/v0.18.64/apps/server/README.md) documents this web mode, token handling, managed engine, and Node requirements. The [npm launcher](https://github.com/different-ai/openwork/blob/v0.18.64/apps/server/bin/openwork-server.mjs) loads the published Node bundle directly.

No upstream code is patched or installed in the workspace. Compose and static hardening checks are run locally; image builds, browser flows, and provider calls have not been executed because Docker daemon access was declined.

## Version and entry point

Pin: [0.18.64](https://github.com/different-ai/openwork/releases/tag/v0.18.64). Entry: [HTTPS app](https://openwork_harness-openwork.app.localhost) · [direct:8780](http://localhost:8780); [setup](README.md).

See [versions.json](../versions.json) for source verification dates.
