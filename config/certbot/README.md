# Certbot utility
- Ensure that port 80 is free
- Specify env vars `HOSTNAME` and `CERTBOT_PATH`
  - Run `./new-cert.sh <domain>` to create new certificate
  - Run `./renew-cert.sh` to renews existing certs in `CERTBOT_PATH`
