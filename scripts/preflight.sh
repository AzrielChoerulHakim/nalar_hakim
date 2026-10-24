#!/usr/bin/env bash
# Read-only. Run on the VPS after reinstall; no secrets are printed.
set -eu
if [ -r /etc/os-release ]; then
  cat /etc/os-release
fi
uname -m
free -h
df -h /
for service in nginx php mariadb mysql; do
  if command -v "$service" >/dev/null 2>&1; then
    "$service" --version 2>&1 | head -n 2
  fi
done
