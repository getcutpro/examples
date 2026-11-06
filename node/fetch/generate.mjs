// Usage: CUTPRO_API_KEY=... node node/fetch/generate.mjs requests/seedance-2.5-text-to-video.json
// Node 18+, no dependencies.
import { readFile } from "node:fs/promises";

const API = "https://api.cut.pro/api/v1";
const headers = { "X-Api-Key": process.env.CUTPRO_API_KEY, "Content-Type": "application/json" };

async function call(path, init = {}) {
	const response = await fetch(`${API}${path}`, { ...init, headers: { ...headers, ...init.headers } });
	const body = await response.json();
	if (!response.ok) throw new Error(`${response.status} ${body.code} ${JSON.stringify(body.extra ?? {})}`);
	return body;
}

const request = JSON.parse(await readFile(process.argv[2], "utf8"));

const { credits } = await call("/generations/quote", { method: "POST", body: JSON.stringify(request) });
console.log(`Price: ${credits} credits`);

let generation = await call("/generations?wait=60", {
	method: "POST",
	headers: { "Idempotency-Key": crypto.randomUUID() },
	body: JSON.stringify({ ...request, credits }),
});
while (generation.status === "processing") generation = await call(`/generations/${generation.id}?wait=60`);

console.log(generation.status === "ready" ? generation.output.url : `Failed: ${generation.error_code} (credits returned)`);
