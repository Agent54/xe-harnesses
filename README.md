# Harness containers

Independent Docker Compose projects for coding agents and web interfaces. Upstream packages and source are fetched inside Docker builds.

See each harness README for setup, versions, entry points, and authentication:

- [aionui](aionui/README.md)
- [buzz](buzz/README.md)
- [cloudflare-os](cloudflare-os/README.md)
- [codex](codex/README.md)
- [deepseek-harness](deepseek-harness/README.md)
- [get-bb](get-bb/README.md)
- [goose](goose/README.md)
- [kimi-code](kimi-code/README.md)
- [librechat](librechat/README.md)
- [openchamber](openchamber/README.md)
- [opencode-2](opencode-2/README.md)
- [openwork](openwork/README.md)
- [paseo](paseo/README.md) (documentation only; Compose project absent)
- [pi](pi/README.md)
- [pi-durable](pi-durable/README.md)
- [qwen-code](qwen-code/README.md)
- [t3-code](t3-code/README.md)
- [trueforge](trueforge/README.md)
- [zcode](zcode/README.md)

## Start

Requires Docker with BuildKit and Compose 2.24+. Enter a harness folder, copy `.env.example` to `.env` if provided, and supply required values.

```sh
cd t3-code
docker compose up --build -d
docker compose logs -f
```

Terminal harnesses use `docker compose run --rm SERVICE`; see their READMEs for reusable containers. If the Compose plugin is unavailable, use `docker-compose`.

## State and projects

**State lives in the container's writable layer.** Restarting keeps it; removal, recreation, upgrades, and `run --rm` delete it. Export work before replacing containers.

```sh
docker compose exec SERVICE git clone URL /workspace/project
docker compose cp SERVICE:/workspace ./export
```

Host projects and credentials are not shared automatically. Services run non-root, drop capabilities, prevent privilege escalation, use init processes and bounded logs, and publish ports on loopback. There are no mounts, persistent volumes, Docker sockets, or privileged containers. Never put credentials in build arguments.

## Web origins

Web harnesses accept `PUBLIC_URL` in `.env`: an HTTP(S) origin with optional port, without path, query, fragment, or trailing slash. Defaults use an external `app.localhost` proxy; Compose does not provision DNS, TLS, or routes. Update the origin when changing proxy addresses or Compose project names.

Preserve external Host and Origin headers, forward WebSocket upgrades, and supply forwarded HTTPS headers where supported. Application mappings and provider-login restrictions are documented in each harness README.

Configuration changes require recreation; Dockerfile, entrypoint, and patch changes require rebuilding. Export state first.

## Versions and validation

[versions.json](versions.json) records pins, source links, and verification dates. Supporting runtimes stay on compatible branches. Package pins do not fully lock OS repositories or transitive dependencies.

Prior static checks covered Compose schemas, mounts, non-root users, and public origins. Builds, startup, browser flows, and provider calls have not been comprehensively runtime-tested. Validate a chosen project with `docker compose config --quiet`, build it, inspect logs, and exercise its UI/API and model call.

After building, `docker image inspect IMAGE --format '{{json .Config.Volumes}}'` should report `null`; `docker inspect CONTAINER --format '{{json .Mounts}}'` should report `[]`.
