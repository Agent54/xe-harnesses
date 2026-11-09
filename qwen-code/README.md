# Qwen Code

Qwen's coding agent with a browser shell.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agents` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Uses bearer-token authentication and explicit origin allowance. The upstream mobile pairing QR flow does not infer HTTPS behind a TLS proxy.

Upstream pin: [0.26.7](https://github.com/QwenLM/qwen-code/releases/tag/v0.26.7). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
