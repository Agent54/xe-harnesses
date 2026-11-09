# goose

## Version and entry point

Pin: [1.57.0](https://github.com/aaif-goose/goose/releases/tag/v1.57.0). Entry: CLI.

See [versions.json](../versions.json) for source verification dates.

choose a provider/model with `goose configure`, or set `GOOSE_PROVIDER`, `GOOSE_MODEL`, and the provider API key. The native desktop shell is not included.

## Start

Copy `.env.example` to `.env` and supply the required model and provider credentials.

```sh
docker compose build
docker compose run --rm goose
# Keep a reusable container:
docker compose up -d
docker compose attach goose
```

Detach with `Ctrl-P`, `Ctrl-Q`. Projects belong in `/workspace`. Restarting keeps state; recreation, removal, and `run --rm` delete it. No ports or mounts are exposed.
