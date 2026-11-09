# syntax=docker/dockerfile:1
FROM postgres:17.11-alpine AS upstream
USER root
RUN mkdir -p /var/lib/postgresql/buzz && chown postgres:postgres /var/lib/postgresql/buzz
# Copying the filesystem strips upstream VOLUME metadata without changing PostgreSQL.
FROM scratch
COPY --from=upstream / /
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    LANG=en_US.utf8 PG_MAJOR=17 PG_VERSION=17.11 PGDATA=/var/lib/postgresql/buzz
USER postgres
WORKDIR /var/lib/postgresql
STOPSIGNAL SIGINT
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]
