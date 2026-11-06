"""Usage: CUTPRO_API_KEY=... python python/requests/generate.py requests/seedance-2.5-text-to-video.json"""

import json
import os
import sys
import uuid

import requests

API = "https://api.cut.pro/api/v1"
HEADERS = {"X-Api-Key": os.environ["CUTPRO_API_KEY"]}


def call(method, path, **kwargs):
    response = requests.request(method, f"{API}{path}", headers={**HEADERS, **kwargs.pop("headers", {})}, timeout=90, **kwargs)
    body = response.json()
    if not response.ok:
        raise RuntimeError(f"{response.status_code} {body.get('code')} {body.get('extra', {})}")
    return body


with open(sys.argv[1], encoding="utf-8") as file:
    request = json.load(file)

credits = call("POST", "/generations/quote", json=request)["credits"]
print(f"Price: {credits} credits")

generation = call("POST", "/generations", params={"wait": 60}, headers={"Idempotency-Key": str(uuid.uuid4())}, json={**request, "credits": credits})
while generation["status"] == "processing":
    generation = call("GET", f"/generations/{generation['id']}", params={"wait": 60})

print(generation["output"]["url"] if generation["status"] == "ready" else f"Failed: {generation['error_code']} (credits returned)")
