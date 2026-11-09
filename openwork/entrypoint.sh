#!/bin/sh
set -eu

# PUBLIC_URL is deployment input; OpenWork's native setting is a host allowlist.
PUBLIC_URL="$(node -e '
  const url = new URL(process.env.PUBLIC_URL);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("PUBLIC_URL must be an http(s) origin without credentials, path, query, or fragment");
  }
  console.log(url.origin);
')"
export PUBLIC_URL
OPENWORK_ALLOWED_HOSTS="$(node -p 'new URL(process.env.PUBLIC_URL).hostname')"
OPENWORK_CORS_ORIGINS="$PUBLIC_URL"
export OPENWORK_ALLOWED_HOSTS OPENWORK_CORS_ORIGINS
printf 'OpenWork public URL: %s\n' "$PUBLIC_URL"
exec openwork-server "$@"
