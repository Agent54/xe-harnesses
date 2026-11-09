# T3 Code behind a proxy

The default public address is [https://t3-code_harness-t3-code.app.localhost](https://t3-code_harness-t3-code.app.localhost). Set `PUBLIC_URL` in `.env` for another origin. It is available to the container and its agents; T3 itself derives browser-facing URLs from requests rather than a public-base-URL environment setting.

The reverse proxy must preserve `Host`, send `X-Forwarded-Host` with the external host and `X-Forwarded-Proto: https`, and forward WebSocket upgrades. The pinned release [honors forwarded HTTPS](https://github.com/pingdotgg/t3code/blob/v0.1.7/apps/server/src/requestUrl.ts) and [accepts the matching request/forwarded host for browser authentication](https://github.com/pingdotgg/t3code/blob/v0.1.7/apps/server/src/auth/EnvironmentAuth.ts). Do not set the bind host to the external hostname: it must remain `0.0.0.0` inside the container.

Links printed by a CLI command such as `t3 pair` may use the server's recorded internal listener. When using one behind the proxy, retain its pairing path and fragment but use the external origin above. Provider sign-ins can have their own fixed loopback callbacks; setting `PUBLIC_URL` cannot change a provider's registered OAuth redirect URI. Use the provider's supported device-code flow for a browser on another machine.

The image and Compose setup remain mount-free and non-root. Recreating the container removes its state. See the root README for build and project setup. Authenticate Codex in this container with `docker compose exec t3-code codex login --device-auth`, or supply `OPENAI_API_KEY` in `.env`. Enable and authenticate additional providers in Settings.

## Version and entry point

Pin: [0.1.7](https://github.com/pingdotgg/t3code/releases/tag/v0.1.7). Entry: [HTTPS app](https://t3-code_harness-t3-code.app.localhost) · [direct:3773](http://localhost:3773).

See [versions.json](../versions.json) for source verification dates.

runs the upstream headless web server, including project/worktree management, terminals, review, and provider orchestration. Codex 0.166.0, OpenCode 2.2.5, Pi 1.5.0, Git, GitHub CLI, SSH, Python, and ripgrep are included. Enable and authenticate providers in Settings. Additional providers can be installed into the non-root user's writable npm prefix. Desktop-only OS integrations, local desktop browser/cookie access, and host file access require a native app or additional integration; a browser container cannot provide those unchanged. See [upstream installation/providers](https://github.com/pingdotgg/t3code/blob/v0.1.7/docs/user/install.md).
