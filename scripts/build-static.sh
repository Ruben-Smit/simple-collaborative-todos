#!/usr/bin/env sh
# Build a fully static SPA bundle suitable for serving from any static host
# (e.g. nginx, GitHub Pages). Output is written to ./build.
set -e
BUILD_MODE=static npx vite build "$@"
