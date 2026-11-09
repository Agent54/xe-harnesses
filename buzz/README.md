# Buzz

[block/buzz](https://github.com/block/buzz) at [desktop-v0.5.28](https://github.com/block/buzz/releases/tag/desktop-v0.5.28), verified 2026-11-04. This runs Buzz's relay, bundled web client, PostgreSQL, Redis, and S3 storage. Silo is the maintained S3-compatible storage dependency selected by [Buzz's own release Compose file](https://github.com/block/buzz/blob/desktop-v0.5.28/deploy/compose/compose.yml), not a different harness.

Copy `.env.example` to `.env`, fill every required secret, then:

```sh
docker compose up --build -d
```

Open <https://relay_harness-buzz.app.localhost>. Connect a Buzz native client to `wss://relay_harness-buzz.app.localhost` if preferred. Set `PUBLIC_URL` in `.env` for a different HTTP(S) origin; the startup command derives its matching public `ws://` or `wss://` `RELAY_URL` and defaults `BUZZ_CORS_ORIGINS` to that browser origin. Set `BUZZ_CORS_ORIGINS` explicitly if additional browser/native clients need other origins. The TLS proxy must preserve Host and WebSocket upgrades. PostgreSQL, Redis, and object-storage ports stay internal. Use URL-safe database and Redis passwords (hex from `openssl rand -hex 32` works).

The optional `agent` profile includes `buzz-acp`, Buzz's CLI/MCP tools, and Goose 1.57.0. Generate a separate agent identity after the relay starts:

```sh
docker compose exec relay buzz-admin generate-key
docker compose exec relay buzz-admin add-member --pubkey YOUR_AGENT_PUBLIC_KEY
```

Save the generated secret key as `BUZZ_PRIVATE_KEY`, configure `GOOSE_MODEL` and its provider API key, and register that agent's owner and channel membership through Buzz's agent setup. Then run `docker compose --profile agent up --build -d`. The bridge keeps Buzz's default `owner-only` author gate: it will not answer until an owner is registered. See the [upstream ACP guide](https://github.com/block/buzz/blob/desktop-v0.5.28/crates/buzz-acp/README.md).

No source is patched or cloned into this workspace. The Dockerfile fetches the release source during its build and uses the release's frozen lockfiles. All services run as non-root. Separate datastore Dockerfiles strip upstream `VOLUME` declarations, so Docker creates no anonymous data volumes. State survives a restart of the same container but is lost on removal/recreation; recreating only one datastore can leave the remaining stores inconsistent, so recreate the whole stack together when resetting it.

The database pins use maintained PostgreSQL 17.11 and Redis 7.4.12; Silo and its client retain Buzz's exact digest pins. These are compatibility pins, not the newest Silo releases ([release page](https://github.com/pgsty/silo/releases) checked 2026-11-04; a newer October 26 release is available). Public push, external authentication, and a public TLS ingress are not enabled. Source builds are substantial. Compose configuration was checked; images were not built or started because Docker access was declined.

## Version and entry point

Pin: [0.5.28](https://github.com/block/buzz/releases/tag/desktop-v0.5.28). Entry: [HTTPS app](https://relay_harness-buzz.app.localhost) · [direct:3031](http://localhost:3031); [setup](README.md).

See [versions.json](../versions.json) for source verification dates.
