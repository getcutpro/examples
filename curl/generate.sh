#!/usr/bin/env bash
# Usage: CUTPRO_API_KEY=... ./curl/generate.sh requests/seedance-2.5-text-to-video.json
# Needs curl 7.76+ and jq.
set -euo pipefail

API="https://api.cut.pro/api/v1"
REQUEST="$(cat "$1")"
call() { curl --silent --show-error --fail-with-body -H "X-Api-Key: $CUTPRO_API_KEY" -H "Content-Type: application/json" "$@"; }

credits="$(call -X POST "$API/generations/quote" -d "$REQUEST" | jq '.credits')"
echo "Price: $credits credits"

generation="$(call -X POST "$API/generations?wait=60" -H "Idempotency-Key: $(uuidgen 2>/dev/null || date +%s%N)" -d "$(jq -c --argjson credits "$credits" '. + { credits: $credits }' <<<"$REQUEST")")"
while [ "$(jq -r '.status' <<<"$generation")" = "processing" ]; do
	generation="$(call "$API/generations/$(jq -r '.id' <<<"$generation")?wait=60")"
done

jq -r 'if .status == "ready" then .output.url else "Failed: \(.error_code) (credits returned)" end' <<<"$generation"
