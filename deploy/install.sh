#!/usr/bin/env bash
# Install/update the prebuilt public site; no Python, Node, PHP or database.
set -euo pipefail
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
[[ $EUID -eq 0 ]] || { printf 'Jalankan: sudo bash deploy/install.sh\n' >&2; exit 1; }
command -v nginx >/dev/null || { printf 'Pasang nginx dahulu sesuai PANDUAN_VPS.md.\n' >&2; exit 1; }
nginx -t
bash "$script_dir/release.sh" /var/www/nalarhakim
if [[ -e /etc/nginx/sites-available/nalarhakim-public || -L /etc/nginx/sites-available/nalarhakim-public ]]; then
    bash "$script_dir/configure-nginx.sh" keep
else
    bash "$script_dir/configure-nginx.sh" http
fi
systemctl enable nginx >/dev/null
printf '\nFile publik terpasang. Periksa: http://nalarhakim.com\n'
if ! grep -q 'listen 443 ssl' /etc/nginx/sites-available/nalarhakim-public; then
    printf 'Sesudah DNS dan port 80/443 benar, jalankan: sudo bash deploy/enable-https.sh\n'
else
    printf 'HTTPS dipertahankan. Periksa: https://nalarhakim.com\n'
fi
