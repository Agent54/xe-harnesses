# AionUI

```sh
docker compose up --build -d
docker compose logs -f aionui
```

Open [https://aionui_harness-aionui.app.localhost](https://aionui_harness-aionui.app.localhost). Set `PUBLIC_URL` in `.env` if the proxy serves another origin. On first startup the upstream WebUI creates an admin password and prints its username and password in the logs. Sign in and change them in Settings. This uses the application's own authentication; the public host port is limited to loopback.

The entrypoint maps the public URL's scheme to AionCore's native `AIONUI_HTTPS` flag, so TLS termination at the proxy still produces Secure session and CSRF cookies. For direct HTTP access, set `PUBLIC_URL=http://localhost:25808` and recreate the service. The SPA's API and WebSocket URLs use the browser's origin; the proxy must pass WebSocket upgrades (`/ws` and `/api/stt/stream`). AionUI's internal API hop intentionally rewrites `Host` to the local AionCore listener; no unsupported forwarded-header trust or wildcard CORS option is added. See the pinned [web proxy](https://github.com/iOfficeAI/AionUi/blob/v2.2.2/packages/web-host/src/static-server.ts) and [cookie configuration](https://github.com/iOfficeAI/AionCore/blob/v0.2.2/crates/aionui-auth/src/cookie.rs).

The container runs the upstream standalone `aionui-web` executable, its SPA, and AionCore backend without Electron or a display server. Codex 0.166.0 is installed as an available agent. Authenticate it in the same running container with `docker compose exec aionui codex login --device-auth`, or set `OPENAI_API_KEY` in `.env`. This avoids a browser callback to a loopback listener inside the container; the public WebUI URL does not change a CLI OAuth client's registered callback. Other provider keys can be supplied as shown in `.env.example` or configured in the app. Additional external agent CLIs can be added to the Dockerfile or installed into the service user's writable npm prefix; supplying a key alone does not install that CLI.

Use `/workspace` for projects. Accounts, credentials, conversation history, managed resources, and files stay inside the container. There are no mounts, including anonymous data volumes. Restarting preserves state; recreating or deleting the container loses it. Browser integrations that depend on a native desktop browser or desktop-only Electron APIs are not included.

Version evidence, checked 2026-11-04:

- Latest stable [AionUI v2.2.2](https://github.com/iOfficeAI/AionUi/releases/tag/v2.2.2). Its release has no downloadable AionUI assets, so the Dockerfile fetches tagged source **inside the build** and uses the upstream [web packaging script](https://github.com/iOfficeAI/AionUi/blob/v2.2.2/scripts/pack-web-cli.js).
- That source pins [AionCore v0.2.2](https://github.com/iOfficeAI/AionCore/releases/tag/v0.2.2), with published GNU/Linux x64 and arm64 assets. Its own packaging step prepares the managed resources and includes them in the web distribution.
- The compiler is [Bun 1.4.4](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.4). Node 24.22.2 is within AionUI's declared Node `>=22 <25` range; Debian Trixie supplies a recent glibc for the downloaded native backend, and ICU supports managed Office tools.

The tagged repository's root Dockerfile references obsolete build scripts, so this image follows its current standalone web build path instead. Upstream source is not patched, cloned, or installed in the workspace. Source builds need network access and substantial memory/disk. Compose and static configuration checks were run; the image and browser/provider flows were not built or executed because Docker daemon access was declined.

## Version and entry point

Pin: [2.2.2](https://github.com/iOfficeAI/AionUi/releases/tag/v2.2.2). Entry: [HTTPS app](https://aionui_harness-aionui.app.localhost) · [direct:25808](http://localhost:25808); [setup](README.md).

See [versions.json](../versions.json) for source verification dates.
