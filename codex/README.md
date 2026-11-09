# codex

## Version and entry point

Pin: [0.166.0](https://github.com/openai/codex/releases/tag/rust-v0.166.0). Entry: CLI.

See [versions.json](../versions.json) for source verification dates.

## Start

```sh
docker compose build
docker compose run --rm codex
# Keep a reusable container:
docker compose up -d
docker compose attach codex
```

Detach with `Ctrl-P`, `Ctrl-Q`. Projects belong in `/workspace`. Restarting keeps state; recreation, removal, and `run --rm` delete it. No ports or mounts are exposed.

Sign in within the terminal, or use `docker compose exec codex codex login --device-auth`. Alternatively set `OPENAI_API_KEY` in `.env`.

Codex's inner Linux sandbox may require user namespaces that a Docker host disables. These files retain the upstream sandbox and Docker defaults instead of granting extra capabilities or disabling seccomp. If your host prevents it from starting, review that host's nested-sandbox support before changing permissions.
