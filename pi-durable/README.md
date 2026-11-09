# Pi Durable public URL

The API is available through the local TLS proxy at [https://pi-durable_harness-pi-durable.app.localhost](https://pi-durable_harness-pi-durable.app.localhost). Set `PUBLIC_URL` in `.env` to the actual HTTP(S) origin if it differs. The wrapper validates and advertises that URL in its startup message; its internal listener remains on port 8080.

This is a bearer-authenticated HTTP API with no browser UI, cookies, WebSockets, or OAuth redirects. It does not need a wildcard CORS policy or forwarded-header trust to operate behind an HTTPS proxy. Keep the authorization header intact when proxying requests. Native provider/CLI loopback callbacks are not redirected by changing deployment metadata.

Use `POST /message` with the `PI_TOKEN` bearer and JSON `message` / `requestId` fields as shown below. `/health` stays unauthenticated. There are no mounts; recreating the container deletes its state.

## Version and entry point

Pin: [1.5.0](https://github.com/earendil-works/pi/releases/tag/v1.5.0), experimental runtime. Entry: [HTTPS API](https://pi-durable_harness-pi-durable.app.localhost/health) · [direct:8080](http://localhost:8080/health).

See [versions.json](../versions.json) for source verification dates.

## API

The wrapper installs the upstream `CodingTools` extension (`read`, `write`, `edit`, `bash`) and a Node execution environment. SQLite checkpoints allow work to resume after a **process/container restart**, provided the same container still exists. This provides one shared conversation, not a native Pi terminal UI or a new frontend.

```sh
curl https://pi-durable_harness-pi-durable.app.localhost/message \
  -H "Authorization: Bearer $PI_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"requestId":"task-1","message":"List the files in /workspace"}'
```

Use the same `requestId` to recover a submission after a disconnect; use a new ID for a new message. Bearer tokens grant the coding tools access to the container. API replies include the submission ID, terminal status, and assistant model content. `/health` is unauthenticated.
