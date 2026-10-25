#!/usr/bin/env bash
# Obtain TLS through the existing nginx ACME route, without editing other sites.
set -euo pipefail
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
fail() { printf 'Gagal: %s\n' "$*" >&2; exit 1; }
[[ $EUID -eq 0 ]] || fail 'Jalankan dengan sudo.'
config=/etc/nginx/sites-available/nalarhakim-public
[[ -f "$config" && ! -L "$config" ]] || fail 'Pasang situs HTTP melalui install.sh terlebih dahulu.'
grep -Fxq '# nalarhakim-public managed nginx v1' "$config" || fail 'Konfigurasi nginx bukan milik installer ini.'
if command -v certbot >/dev/null; then
    certbot_bin=$(command -v certbot)
elif [[ -x /snap/bin/certbot ]]; then
    certbot_bin=/snap/bin/certbot
else
    fail 'Certbot belum tersedia. Ikuti langkah Certbot di PANDUAN_VPS.md.'
fi
hook=/etc/letsencrypt/renewal-hooks/deploy/nalarhakim-public-reload
hook_marker='# nalarhakim-public managed renewal hook v1'
if [[ -e "$hook" || -L "$hook" ]]; then
    [[ -f "$hook" && ! -L "$hook" ]] || fail 'Lokasi renewal hook sudah dipakai file lain.'
    grep -Fxq "$hook_marker" "$hook" || fail 'Renewal hook sudah dipakai konfigurasi lain.'
fi
nginx -t
printf 'Certbot akan meminta email dan persetujuan ketentuan layanan.\n'
"$certbot_bin" certonly --webroot --webroot-path /var/lib/nalarhakim-acme \
    --cert-name nalarhakim.com -d nalarhakim.com -d www.nalarhakim.com
bash "$script_dir/configure-nginx.sh" https
install -d -m 755 "$(dirname "$hook")"
cat > "$hook" <<'HOOK'
#!/bin/sh
# nalarhakim-public managed renewal hook v1
set -eu
/usr/sbin/nginx -t
/bin/systemctl reload nginx
HOOK
chmod 755 "$hook"
printf '\nHTTPS aktif: https://nalarhakim.com\n'
printf 'Uji pembaruan sertifikat: sudo %s renew --dry-run\n' "$certbot_bin"
