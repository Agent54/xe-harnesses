#!/bin/sh
set -eu

# Keep the upstream authentication flow while advertising the proxy's origin.
if [ -z "${ZCODE_TOKEN:-}" ]; then
  ZCODE_TOKEN="$(node -e 'console.log(require("node:crypto").randomBytes(24).toString("base64url"))')"
fi
export ZCODE_TOKEN
node -e '
  const url = new URL(process.env.PUBLIC_URL);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("PUBLIC_URL must be an http(s) origin without credentials, path, query, or fragment");
  }
  url.searchParams.set("token", process.env.ZCODE_TOKEN);
  console.log(`ZCode public access URL: ${url}`);
'
exec node /opt/zcode/bin/zcode.mjs "$@" --token "$ZCODE_TOKEN"
