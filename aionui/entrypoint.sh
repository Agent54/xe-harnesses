#!/bin/sh
set -eu

# AionCore uses an explicit HTTPS flag rather than trusting forwarded headers.
AIONUI_HTTPS="$(node -e '
  const url = new URL(process.env.PUBLIC_URL);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("PUBLIC_URL must be an http(s) origin without credentials, path, query, or fragment");
  }
  console.log(url.protocol === "https:");
')"
export AIONUI_HTTPS
printf 'AionUI public URL: %s\n' "$PUBLIC_URL"
exec /opt/aionui/aionui-web "$@"
