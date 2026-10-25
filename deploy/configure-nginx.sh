#!/usr/bin/env bash
# Change only this site's vhost; restore it if validation/reload fails.
set -euo pipefail
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
mode=${1:-keep}
config=/etc/nginx/sites-available/nalarhakim-public
enabled=/etc/nginx/sites-enabled/nalarhakim-public
marker='# nalarhakim-public managed nginx v1'
fail() { printf 'Gagal: %s\n' "$*" >&2; exit 1; }
[[ $EUID -eq 0 ]] || fail 'Jalankan dengan sudo.'
command -v nginx >/dev/null || fail 'Pasang nginx terlebih dahulu; lihat PANDUAN_VPS.md.'
[[ -d /etc/nginx/sites-available && -d /etc/nginx/sites-enabled ]] || fail 'Diperlukan tata letak nginx Ubuntu.'
if [[ -e "$config" || -L "$config" ]]; then
    [[ -f "$config" && ! -L "$config" ]] || fail "Lokasi $config sudah dipakai file lain."
    grep -Fxq "$marker" "$config" || fail "Konfigurasi $config bukan milik installer ini."
fi
if [[ -e "$enabled" || -L "$enabled" ]]; then
    [[ -L "$enabled" && "$(readlink -f "$enabled")" = "$config" ]] || fail "Lokasi $enabled sudah dipakai konfigurasi lain."
fi
case "$mode" in
    http) source_config="$script_dir/nginx-http.conf" ;;
    https)
        [[ -r /etc/letsencrypt/live/nalarhakim.com/fullchain.pem && -r /etc/letsencrypt/live/nalarhakim.com/privkey.pem ]] || fail 'Sertifikat belum tersedia. Jalankan enable-https.sh.'
        source_config="$script_dir/nginx-https.conf" ;;
    keep) [[ -f "$config" ]] || fail 'Konfigurasi yang hendak dipertahankan belum ada.'; source_config="$config" ;;
    *) fail 'Mode harus http, https, atau keep.' ;;
esac
nginx -t
conflicts=$(nginx -T 2>/dev/null | awk '
    /^# configuration file / { source=$4; sub(/:$/, "", source) }
    /^[[:space:]]*#/ { next }
    /(^|[^A-Za-z0-9_.-])(www\.)?nalarhakim\.com([^A-Za-z0-9_.-]|$)/ {
        if (source != "/etc/nginx/sites-enabled/nalarhakim-public" && source != "/etc/nginx/sites-available/nalarhakim-public") print source
    }' | sort -u)
[[ -z "$conflicts" ]] || fail "Domain sudah disebut konfigurasi lain; periksa tanpa menghapusnya: $conflicts"
mkdir -p /var/lib/nalarhakim-acme/.well-known/acme-challenge
chmod 755 /var/lib/nalarhakim-acme /var/lib/nalarhakim-acme/.well-known /var/lib/nalarhakim-acme/.well-known/acme-challenge
transaction=$(mktemp -d)
had_config=0
had_link=0
committed=0
[[ ! -f "$config" ]] || { cp "$config" "$transaction/previous"; had_config=1; }
[[ ! -L "$enabled" ]] || had_link=1
cleanup() {
    if [[ "$committed" -eq 0 ]]; then
        if [[ "$had_config" -eq 1 ]]; then install -m 644 "$transaction/previous" "$config"; else rm -f "$config"; fi
        [[ "$had_link" -eq 1 ]] || rm -f "$enabled"
    fi
    rm -rf "$transaction"
}
trap cleanup EXIT
cp "$source_config" "$transaction/proposed"
install -m 644 "$transaction/proposed" "$config"
[[ "$had_link" -eq 1 ]] || ln -s "$config" "$enabled"
nginx -t
if systemctl is-active --quiet nginx; then systemctl reload nginx; else systemctl start nginx; fi
committed=1
printf 'Konfigurasi nginx aktif (%s). Vhost lain tetap dipertahankan.\n' "$mode"
