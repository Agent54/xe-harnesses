# ZCode

```sh
docker compose up --build -d
docker compose logs zcode
```

Open the `ZCode public access URL:` printed in the logs. It uses `PUBLIC_URL` (default [https://zcode_harness-zcode.app.localhost](https://zcode_harness-zcode.app.localhost)) with the required `?token=...`. Set another public origin in `.env` when needed. You can also set a stable `ZCODE_TOKEN`; otherwise the entrypoint generates one on every process start and supplies it to the unchanged upstream launcher. It runs the packaged web UI, server, and agent without Electron. Projects live at `/workspace` inside the container.

The web client uses the browser's origin for its API and `/ws` connection; preserve the original `Host` header and WebSocket upgrades in the TLS proxy. `PUBLIC_URL` is deployment metadata consumed by the entrypoint, not an invented ZCode canonical-origin option. ZCode's web OAuth configuration separately targets its registered vendor endpoints: setting `VITE_ZCODE_BASE_URL` to the container URL would also move hosted API endpoints and is not a valid generic redirect fix. The pinned [OAuth config](https://github.com/zai-org/ZCode/blob/v3.17.1/packages/web/src/auth/webZaiOAuthConfig.ts) and [return-to validation](https://github.com/zai-org/ZCode/blob/v3.17.1/packages/web/src/auth/oauthStateCodec.ts) do not authorize arbitrary custom-domain callbacks. Use API-key provider configuration for this local self-hosted origin unless you have a provider-registered OAuth callback and matching vendor backend. No OAuth allowlist is weakened.

The latest stable [release v3.17.1](https://github.com/zai-org/ZCode/releases/tag/v3.17.1) was checked on 2026-11-04. That release publishes desktop installers, so the Dockerfile builds its tagged source using the upstream [CLI distribution script](https://github.com/zai-org/ZCode/blob/v3.17.1/scripts/build-zcode.mjs). The script's required download-base setting only generates installer metadata; this container executes the bundled runtime directly and does not install from that URL.

No source is patched or stored outside the image build. There are no mounts; configuration, sessions, and project files survive container restarts but are lost when the container is recreated or removed. Browser integrations requiring a desktop browser or additional browser binaries are not included. Container build and startup have not been executed here because Docker access was declined.

## Version and entry point

Pin: [3.17.1](https://github.com/zai-org/ZCode/releases/tag/v3.17.1). Entry: [HTTPS app](https://zcode_harness-zcode.app.localhost) · [direct:3030](http://localhost:3030).

See [versions.json](../versions.json) for source verification dates.
