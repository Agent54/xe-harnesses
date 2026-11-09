# Kimi Code CLI

Runs the upstream TypeScript terminal coding agent, pinned to [2.5.2](https://github.com/MoonshotAI/kimi-code/releases/tag/%40moonshot-ai/kimi-code%402.5.2), using `@moonshot-ai/kimi-code`. This is the maintained successor to the archived Python `kimi-cli` project.

```sh
docker compose build
docker compose run --rm kimi-code
```

Run `/login` inside Kimi and choose Kimi Code OAuth or a Kimi Platform API key. OAuth uses a device code, so open the displayed link on your host and enter the code. For a reusable container that retains login and work:

```sh
docker compose up -d
docker compose attach kimi-code
```

Detach with `Ctrl-P`, `Ctrl-Q`. Configuration, OAuth credentials, and sessions live under `/home/node/.kimi-code`. Select a model with `/model`. Automatic CLI updates are disabled to retain the image's pinned version; rebuild with a reviewed version change to upgrade.

For environment-based API authentication, copy `.env.example` to `.env` and set **both** `KIMI_MODEL_NAME` and `KIMI_MODEL_API_KEY`, plus the base URL for that key. For a Kimi Code subscription key, use `kimi-for-coding` and `https://api.kimi.com/coding/v1`. For a Moonshot platform key, use a model available to your account and the default `https://api.moonshot.ai/v1`. An empty `KIMI_MODEL_NAME` leaves saved configuration and `/login` in control. A non-empty name creates an upstream temporary model override in memory; plain `KIMI_API_KEY` is not automatically read by this CLI. Other providers can be configured in `config.toml` using upstream provider settings.

Arguments are forwarded to `kimi`:

```sh
docker compose run --rm kimi-code --help
docker compose run --rm kimi-code -p "List the files in /workspace"
```

Clone projects into `/workspace` using a container shell (`docker compose exec kimi-code sh`), or transfer files with `docker compose cp`. The service runs as the non-root `node` user, drops capabilities, prevents privilege escalation, and publishes no ports. There are no mounts. Restarting the same container keeps its state; `down`, recreation, and `run --rm` delete it. Export needed files before removing it.

Sources: pinned [getting started](https://github.com/MoonshotAI/kimi-code/blob/%40moonshot-ai/kimi-code%402.5.2/docs/en/guides/getting-started.md) and [environment variables](https://github.com/MoonshotAI/kimi-code/blob/%40moonshot-ai/kimi-code%402.5.2/docs/en/configuration/env-vars.md).

## Version and entry point

Pin: [2.5.2](https://github.com/MoonshotAI/kimi-code/releases/tag/%40moonshot-ai/kimi-code%402.5.2). Entry: CLI; [setup](README.md).

See [versions.json](../versions.json) for source verification dates.
