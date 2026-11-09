# Xe harnesses

Agent apps for **Xe Computer**, listed in the [Xe Appstore](https://github.com/Agent54/xe-appstore) under `agent`. These Compose definitions are Xe Computer integration assets, not standalone deployments. They should not be used directly or outside Xe Computer.

- [AionUI](aionui/README.md)
- [Buzz](buzz/README.md)
- [Cloudflare OS](cloudflare-os/README.md)
- [Codex](codex/README.md)
- [DeepSeek Harness](deepseek-harness/README.md)
- [bb](get-bb/README.md)
- [Goose](goose/README.md)
- [Kimi Code](kimi-code/README.md)
- [LibreChat](librechat/README.md)
- [OpenChamber](openchamber/README.md)
- [OpenCode](opencode-2/README.md)
- [OpenWork](openwork/README.md)
- [Pi](pi/README.md)
- [Pi Durable](pi-durable/README.md)
- [Qwen Code](qwen-code/README.md)
- [T3 Code](t3-code/README.md)
- [TrueForge](trueforge/README.md)
- [ZCode](zcode/README.md)

Containers have no persistent mounts. State survives a restart of the same container but is lost on removal or recreation. Host files and credentials are not shared automatically.

[versions.json](versions.json) records pinned upstream releases and verification dates. Build and runtime validation is incomplete; individual READMEs describe integration limitations.
