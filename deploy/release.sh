#!/usr/bin/env bash
# Validate and atomically activate public files. No package/service changes.
set -euo pipefail
package_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
destination=${1:-/var/www/nalarhakim}
fail() { printf 'Gagal: %s\n' "$*" >&2; exit 1; }
[[ "$destination" = /* && "${destination##*/}" = nalarhakim ]] || fail 'Direktori tujuan harus absolut dan berakhir /nalarhakim.'
[[ ! -L "$destination" ]] || fail 'Direktori tujuan tidak boleh berupa symlink.'
[[ -d "$package_dir/public" && ! -L "$package_dir/public" && -f "$package_dir/SHA256SUMS" ]] || fail 'Paket tidak lengkap: public/ atau SHA256SUMS tidak ada.'
[[ -z "$(find "$package_dir/public" -type l -print -quit)" ]] || fail 'Paket mengandung symlink.'
[[ -z "$(find "$package_dir/public" ! -type f ! -type d -print -quit)" ]] || fail 'Paket mengandung file khusus.'
while IFS= read -r line; do
    [[ "$line" =~ ^[0-9a-f]{64}\ \ public/[A-Za-z0-9_./-]+$ ]] || fail 'Format checksum tidak sah.'
    name=${line:66}
    [[ "$name" != *'/.'* && "$name" != *'//'* ]] || fail 'Path checksum tidak sah.'
    case "$name" in
        public/*.html|public/robots.txt|public/sitemap.xml) ;;
        public/preview/*)
            case "$name" in *.css|*.js|*.svg|*.webp|*.png|*.jpg|*.jpeg|*.avif|*.woff|*.woff2) ;; *) fail "Aset tidak diizinkan: $name" ;; esac ;;
        public/theme/nalar-hakim/style.css|public/theme/nalar-hakim/assets/site.js) ;;
        *) fail "File tidak boleh dipublikasikan: $name" ;;
    esac
done < "$package_dir/SHA256SUMS"
diff -u <(cd "$package_dir" && find public -type f -print | LC_ALL=C sort) \
    <(cut -c 67- "$package_dir/SHA256SUMS" | LC_ALL=C sort) >/dev/null || fail 'Daftar file berbeda dari checksum.'
(cd "$package_dir" && sha256sum --check --strict --quiet SHA256SUMS) || fail 'Checksum paket tidak cocok.'
for required in index.html 404.html beranda.html robots.txt sitemap.xml; do
    [[ -f "$package_dir/public/$required" ]] || fail "File wajib tidak ada: $required"
done
grep -Fq 'https://nalarhakim.com/' "$package_dir/public/index.html" || fail 'Paket belum dibangun untuk nalarhakim.com.'

marker='# nalarhakim-public managed release directory v1'
if [[ -e "$destination" ]]; then
    [[ -d "$destination" && -f "$destination/.nalarhakim-public" && ! -L "$destination/.nalarhakim-public" ]] || fail 'Tujuan sudah ada dan bukan direktori milik installer ini.'
    [[ "$(cat "$destination/.nalarhakim-public")" = "$marker" ]] || fail 'Penanda direktori tidak cocok.'
fi
[[ ! -e "$destination/current" || -L "$destination/current" ]] || fail 'current sudah ada dan bukan symlink milik rilis.'
if [[ -L "$destination/current" ]]; then
    [[ "$(readlink "$destination/current")" =~ ^releases/[0-9a-f]{20}/public$ ]] || fail 'current menunjuk ke luar tata letak rilis installer ini.'
fi
[[ ! -L "$destination/releases" ]] || fail 'releases tidak boleh berupa symlink.'
mkdir -p -- "$destination/releases"
chmod 755 "$destination" "$destination/releases"
printf '%s\n' "$marker" > "$destination/.nalarhakim-public"
release_id=$(sha256sum "$package_dir/SHA256SUMS" | cut -c 1-20)
release_dir="$destination/releases/$release_id"
stage=''
new_link="$destination/.current-$$"
cleanup() {
    [[ -z "$stage" ]] || rm -rf -- "$stage"
    rm -f -- "$new_link"
}
trap cleanup EXIT
if [[ -e "$release_dir" || -L "$release_dir" ]]; then
    [[ -d "$release_dir" && ! -L "$release_dir" ]] || fail 'Lokasi rilis sudah digunakan oleh file lain.'
    cmp -s "$package_dir/SHA256SUMS" "$release_dir/SHA256SUMS" || fail 'Rilis lama dengan ID sama berbeda.'
    [[ -d "$release_dir/public" && ! -L "$release_dir/public" ]] || fail 'Direktori publik rilis lama tidak sah.'
    [[ -z "$(find "$release_dir/public" -type l -print -quit)" ]] || fail 'Rilis lama mengandung symlink.'
    [[ -z "$(find "$release_dir/public" ! -type f ! -type d -print -quit)" ]] || fail 'Rilis lama mengandung file khusus.'
    diff -u <(cd "$release_dir" && find public -type f -print | LC_ALL=C sort) \
        <(cut -c 67- "$release_dir/SHA256SUMS" | LC_ALL=C sort) >/dev/null || fail 'Rilis lama mengandung file di luar manifest.'
    (cd "$release_dir" && sha256sum --check --strict --quiet SHA256SUMS) || fail 'Rilis lama rusak; periksa sebelum mengganti.'
else
    stage=$(mktemp -d "$destination/releases/.staging.XXXXXXXX")
    cp -R -- "$package_dir/public" "$stage/public"
    cp -- "$package_dir/SHA256SUMS" "$stage/SHA256SUMS"
    find "$stage" -type d -exec chmod 755 {} +
    find "$stage" -type f -exec chmod 644 {} +
    (cd "$stage" && sha256sum --check --strict --quiet SHA256SUMS) || fail 'Verifikasi hasil salin gagal.'
    mv -- "$stage" "$release_dir"
    stage=''
fi
ln -s -- "releases/$release_id/public" "$new_link"
mv -Tf -- "$new_link" "$destination/current"
printf 'Rilis %s aktif di %s/current\n' "$release_id" "$destination"
