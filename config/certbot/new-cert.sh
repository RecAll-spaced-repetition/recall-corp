#!/bin/sh
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d $1
docker compose down
