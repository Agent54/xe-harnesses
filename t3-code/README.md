# T3 Code

A web workspace for coding agents, projects, terminals, and reviews.

This app is an **Xe Computer integration**, distributed through the Xe Appstore's `agents` category. Its Compose definition is not intended for direct use or deployment outside Xe Computer.

Includes Codex, OpenCode, Pi, Git, GitHub CLI, SSH, Python, and ripgrep. Desktop-only integrations and host browser access are absent. Browser-facing URLs derive from request metadata.

Opening the Xe app automatically establishes a normal T3 browser session, without entering a pairing token. The launcher uses the pinned release's Electron bootstrap flow: a random secret goes to the loopback-only T3 backend over private stdin, rotating credentials are exchanged through `/api/auth/browser-session`, and the browser receives T3's HttpOnly session cookie. Credentials are not placed in the browser URL or Compose environment. HTTP streams, uploads, and WebSocket connections pass through to T3, which still enforces API authentication.

Port 3773 is the Xe launcher; the T3 backend listens only on container loopback port 3774. `/healthz` reports backend readiness. Access to the Xe app authorizes use of its T3 environment, including terminals and agents; keep the published port loopback-only and use this integration only behind Xe's trusted app access. No T3 Connect service is needed.

The `@` file picker searches the current thread's workspace, not sibling projects. To reference another repository, attach specific files or give the agent a container-visible absolute path. Host folders must be made available through Xe first; adding a project does not mount its files or add them to another chat's context.

After changing the launcher, rebuild/redeploy the app through Xe. Source-level launcher checks can be run with `node --test server.test.mjs`; Docker is not required for those checks.

Upstream pin: [0.1.7](https://github.com/pingdotgg/t3code/releases/tag/v0.1.7). Source verification date: 2026-11-04.

State is held in the container's writable layer and is lost when the container is removed or recreated. Image builds and end-to-end provider flows have not been comprehensively validated.
