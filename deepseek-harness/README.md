# DeepSeek Harness

Run `docker compose up --build -d`, then inspect `docker compose logs -f deepseek` for the tokenized startup URL. It advertises [the DeepSeek domain](https://deepseek_harness-deepseek.app.localhost) by default. Override `PUBLIC_URL` in `.env` for a different HTTP(S) root.

The launcher passes that URL to upstream `--public-url` and derives its authority for `--trusted-host`. It still binds one concrete container interface because upstream rejects wildcard addresses. The public URL therefore controls startup links and the harness's advertised runtime context while the trust fence accepts the browser's actual host. The reverse proxy must preserve Host, Origin, and WebSocket upgrades and terminate HTTPS. It must not rewrite the browser authority to the container's internal IP. Because the internal listener is HTTP, upstream also requires the HTTPS proxy to add `Secure` to session cookies; a deployment under a path prefix must strip that prefix and rewrite cookie Path. See the [reverse-proxy guide](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-alpha.3/docs/user/guide/public-deployments.md).

The launch-token exchange and session authentication remain enabled. `PUBLIC_URL` does not create an OAuth registration or change a provider's permitted redirect URIs. No source patch or mount is needed. Image builds and browser/provider flows remain untested because Docker daemon access was declined.

Source: the pinned [web-app deployment guide](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-alpha.3/packages/bundle/web-app/README.md#listening-trust-and-public-deployments).

## Version and entry point

Pin: [0.2.2-alpha.3](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-alpha.3), preview. Entry: [HTTPS app](https://deepseek_harness-deepseek.app.localhost) · [direct:3080](http://localhost:3080).

See [versions.json](../versions.json) for source verification dates.

configure the model API key in Settings → Models. Its configured credential file stays inside the container. Follow the login/pairing URL in its logs if requested.

DeepSeek uses a shell command to select its concrete container IP because upstream rejects wildcard binds. To run an alternate DeepSeek command, include the executable: `docker compose run --rm deepseek dsh --help`.
