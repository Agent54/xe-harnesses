# Cloudflare OS

```sh
docker compose up --build -d
docker compose logs -f
```

Open [the Cloudflare OS domain](https://cloudflare-os_harness-cloudflare-os.app.localhost). `PUBLIC_URL` in `.env` changes the canonical HTTPS origin; Compose passes it to the upstream `PUBLIC_BASE_URL` setting. Create an account; the upstream local runner makes the username `admin` an administrator. Configure a model provider through the UI. Optional OAuth and Cloudflare AI Gateway settings can also be supplied in `.env` without mounting it.

This preserves upstream's **local development mode** on Wrangler/workerd. It builds the frontend at image-build time; the built client selects the browser's own host and HTTP/HTTPS scheme. A TCP forwarder exposes the internal loopback listener. Keep `VITE_BACKEND_HOST=localhost:8787` as the internal Wrangler address: it is not the public browser origin. Startup can take several minutes.

The pinned local runner otherwise hardcodes every gatekeeper callback to `http://localhost:8787`. [public-origin.patch](public-origin.patch) makes that one generated `BASE_URL` use `PUBLIC_BASE_URL`; Docker applies it with `--fuzz=0` and fails if the upstream context changes. This is needed for OAuth callbacks and gatekeeper links on the external domain. Register each provider's redirect URI under that public origin, and have the TLS proxy preserve the browser Host and WebSocket upgrades. Changing `PUBLIC_URL` needs container recreation, not a frontend rebuild; export required state first because recreation deletes it.

There are no mounts. Accounts, gadgets, and local Wrangler state remain in the container's writable layer; recreating or removing the container loses them. This is a local evaluation setup, not the Cloudflare production deployment path.

Upstream [releases](https://github.com/cloudflare/cloudflare-os/releases) were empty on 2026-11-04. The Dockerfile pins [commit a3ba4746b58f1ef8e2252f8bac6b6377099202f0](https://github.com/cloudflare/cloudflare-os/commit/a3ba4746b58f1ef8e2252f8bac6b6377099202f0), following the upstream [local runner](https://github.com/cloudflare/cloudflare-os/blob/a3ba4746b58f1ef8e2252f8bac6b6377099202f0/scripts/run-local.ts). Container build and startup have not been executed here because Docker access was declined.

## Version and entry point

Pin: [a3ba4746b58f](https://github.com/cloudflare/cloudflare-os/commit/a3ba4746b58f1ef8e2252f8bac6b6377099202f0), [no releases](https://github.com/cloudflare/cloudflare-os/releases). Entry: [HTTPS app](https://cloudflare-os_harness-cloudflare-os.app.localhost) · [direct:8787](http://localhost:8787).

See [versions.json](../versions.json) for source verification dates.

Compose also reads the optional `.env` as container environment.
