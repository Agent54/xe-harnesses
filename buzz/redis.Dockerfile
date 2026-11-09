# syntax=docker/dockerfile:1
FROM redis:7.4.12-alpine AS upstream
# Copying the filesystem strips upstream VOLUME /data metadata.
FROM scratch
COPY --from=upstream / /
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
USER redis
WORKDIR /data
ENTRYPOINT ["redis-server"]
