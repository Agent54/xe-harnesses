# syntax=docker/dockerfile:1
# These are the S3 server/client versions selected by Buzz's release Compose file.
FROM pgsty/silo:RELEASE.2026-09-16T00-00-00Z@sha256:635197cb9f36d01bee221d34d1c7d7960f6a95c48b0b6c01d99cd13bdae51a46 AS silo
FROM pgsty/mc:RELEASE.2026-09-16T00-00-00Z@sha256:cfc83108c3abb371f8fb84d99c1fdc88f8c237e022409b0081fb7c0a3be634dd AS client
FROM node:24.22.2-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /data
# Only binaries are inherited; Silo's anonymous data volume is not.
COPY --from=silo /usr/bin/silo /usr/local/bin/silo
COPY --from=client /usr/bin/mc /usr/local/bin/mc
USER node
WORKDIR /data
EXPOSE 9000
ENTRYPOINT ["silo"]
CMD ["server", "/data", "--console-address", ":9001"]
