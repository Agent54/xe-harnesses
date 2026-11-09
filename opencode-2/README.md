# OpenCode

A browser interface for the OpenCode coding agent.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agent` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

The pinned OpenAI browser OAuth flow uses fixed container-local callbacks. Device-code and API-key authentication are supported independently of the app origin.

Upstream pin: [2.2.5](https://github.com/anomalyco/opencode/releases/tag/v2.2.5). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
