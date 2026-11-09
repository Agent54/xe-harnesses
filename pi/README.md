# Pi CLI

Runs the native Pi terminal coding agent, pinned to [1.5.0](https://github.com/earendil-works/pi/releases/tag/v1.5.0), using the upstream `@earendil-works/pi-coding-agent` npm package. Node 24 meets its Node 22.19+ requirement. This is a separate Compose project from the Pi Durable HTTP API.

```sh
docker compose build
docker compose run --rm pi
```

For a reusable container that retains credentials, sessions, and projects:

```sh
docker compose up -d
docker compose attach pi
```

Detach with `Ctrl-P`, `Ctrl-Q`. Use `/login` inside Pi and follow the provider's instructions, or copy `.env.example` to `.env` and set a provider API key before starting. For remote OAuth flows, paste the redirect URL or authorization code back into Pi when prompted. Select a model with `/model`, or pass CLI arguments directly:

```sh
docker compose run --rm pi --help
docker compose run --rm pi --model PROVIDER/MODEL -p "List the files in /workspace"
```

Projects belong in `/workspace`; clone them from a container shell (`docker compose exec pi sh`) or transfer files with `docker compose cp`. Pi's configuration and sessions live under `/home/node/.pi/agent`. The service runs as the non-root `node` user, drops capabilities, prevents privilege escalation, and publishes no ports. There are no mounts. Restarting the same container keeps its state; `down`, recreation, and `run --rm` delete it. Export needed files before removing it.

Sources: pinned [quick start](https://github.com/earendil-works/pi/blob/v1.5.0/README.md), [provider authentication](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/providers.md), and [configuration](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/configuration.md).

## Version and entry point

Pin: [1.5.0](https://github.com/earendil-works/pi/releases/tag/v1.5.0). Entry: CLI; [setup](README.md).

See [versions.json](../versions.json) for source verification dates.
