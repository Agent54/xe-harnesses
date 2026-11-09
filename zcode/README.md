# ZCode

A web coding workspace with an integrated agent.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agents` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Runs without Electron. Vendor OAuth has independent registered callback restrictions; the public app origin does not override them.

Upstream pin: [3.17.1](https://github.com/zai-org/ZCode/releases/tag/v3.17.1). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
