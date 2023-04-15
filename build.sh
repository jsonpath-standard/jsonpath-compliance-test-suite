#!/usr/bin/env sh
set -e
path=$(dirname "$0")
node build.js "$path/tests" > "$path/cts.json"
