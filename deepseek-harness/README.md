# DeepSeek Harness

A web-based coding agent harness.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Launch-token and session authentication remain enabled. Upstream requires a concrete container interface and secure-cookie handling at the HTTPS proxy.

Upstream pin: [0.2.2-alpha.3](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-alpha.3) (preview). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
