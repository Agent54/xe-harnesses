# OpenCode 2

Copy `.env.example` to `.env`, set the password, and start the service:

```sh
docker compose up --build -d
```

The expected public origin is [https://opencode_harness-opencode-2.app.localhost](https://opencode_harness-opencode-2.app.localhost). `PUBLIC_URL` may override that origin, including a nonstandard HTTPS port. Use an origin without a path or trailing slash. The existing local port remains available at `http://localhost:4096`; the HTTPS hostname is served by the external `app.localhost` proxy, not by Compose.

Compose passes the public origin to OpenCode's supported `--cors` allowlist and exports `PUBLIC_URL` for tools and coding agents. OpenCode 2.2.5 has no native public-base-URL setting: its browser UI uses the current origin. The reverse proxy must preserve the public `Host` header and support WebSocket upgrades. Changing `PUBLIC_URL` requires recreating the service; it does not provision DNS, certificates, or proxy routes.

## OpenAI / ChatGPT login

In **Settings → Providers → OpenAI**, choose **Codex device code (legacy)**. Open the authorization link and enter the displayed code. This upstream flow polls for completion from the container and works with the public HTTPS origin without a localhost callback. An API key is also supported.

The other option, **Codex browser (legacy)**, explicitly constructs `http://localhost:1455/auth/callback` (or port 1457) and listens on the container's loopback interface. That is an upstream OAuth-client flow, not an application URL generated from `Host` or forwarded headers. It has no redirect-URL override. Setting `PUBLIC_URL` or changing CORS cannot make that callback reach this container, and replacing the OAuth client's callback with the application domain is not supported by this integration. No extra callback ports or redirect rewrites are added here.

A browser authorization attempt already in progress should be cancelled before selecting device code. Device-code availability may depend on your account or workspace settings. Provider credentials live inside the container, so removing or recreating it deletes them under this stack's no-mount policy.

Verified against the pinned release's [OpenAI integration](https://github.com/anomalyco/opencode/blob/v2.2.5/packages/core/src/plugin/provider/openai.ts), [server options](https://github.com/anomalyco/opencode/blob/v2.2.5/packages/server/src/options.ts), and [origin checks](https://github.com/anomalyco/opencode/blob/v2.2.5/packages/server/src/cors.ts). Configuration checks do not exercise an actual OAuth account login.

## Version and entry point

Pin: [2.2.5](https://github.com/anomalyco/opencode/releases/tag/v2.2.5). Entry: [HTTPS app](https://opencode_harness-opencode-2.app.localhost) · [direct:4096](http://localhost:4096).

See [versions.json](../versions.json) for source verification dates.
