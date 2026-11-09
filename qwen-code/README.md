# Qwen Code behind a proxy

Open [https://qwen-code_harness-qwen-code.app.localhost](https://qwen-code_harness-qwen-code.app.localhost), or set `PUBLIC_URL` in `.env` to the external origin you use. Compose passes that exact origin to `qwen serve --allow-origin`; the pinned release requires this explicit allowance for HTTPS reverse proxies and terminal/voice WebSockets. Local direct access on port 4170 remains allowed.

Supply `QWEN_SERVER_TOKEN` and enter it in the Web Shell's connection screen. Preserve the proxy's external `Host` and forward WebSocket upgrades. Qwen [deliberately does not trust forwarded headers to infer same-origin](https://github.com/QwenLM/qwen-code/blob/v0.26.7/docs/users/qwen-serve.md), so `--allow-origin` is the relevant setting rather than a made-up proxy-trust flag.

Qwen's mobile pairing QR uses the backend's HTTP scheme and does not infer HTTPS from a TLS-terminating proxy. For this setup, enter the existing bearer token at the HTTPS origin instead of using that QR exchange. Provider authentication has separate rules; use the supported device-code flow where a fixed loopback callback cannot reach the container.

The container stays non-root and mount-free. Recreating it removes credentials, projects, and session state.

## Version and entry point

Pin: [0.26.7](https://github.com/QwenLM/qwen-code/releases/tag/v0.26.7). Entry: [HTTPS app](https://qwen-code_harness-qwen-code.app.localhost) · [direct:4170](http://localhost:4170).

See [versions.json](../versions.json) for source verification dates.

set the UI password or bearer token from `.env.example`. Qwen's browser connection screen accepts `QWEN_SERVER_TOKEN`. Paseo and bb include the pinned Codex provider; other provider CLIs can be added in their Dockerfiles.
