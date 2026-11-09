# syntax=docker/dockerfile:1
# Copy the unchanged upstream filesystem, without inheriting VOLUME metadata.
FROM mongo:8.0.20 AS upstream
FROM scratch
COPY --from=upstream / /
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin HOME=/data/db
USER mongodb
EXPOSE 27017
ENTRYPOINT ["/usr/bin/mongod"]
CMD ["--bind_ip_all", "--dbpath", "/data/db"]
