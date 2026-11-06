// Next.js App Router: POST starts a Seedance 2.5 video, GET ?id= reads it. Put your own auth in front: every POST spends credits.
import { CutPro, CutProError } from "@cutpro/sdk";

const cutpro = new CutPro(); // reads CUTPRO_API_KEY on the server

export const maxDuration = 60;

function failure(error: unknown) {
	if (error instanceof CutProError) return Response.json({ code: error.code, extra: error.extra }, { status: error.status || 502 });
	throw error;
}

export async function POST(request: Request) {
	const { prompt } = await request.json();
	if (typeof prompt !== "string" || !prompt.trim()) return Response.json({ code: "PROMPT_REQUIRED" }, { status: 400 });
	try {
		const generation = await cutpro.generations.create(
			{ model: "bytedance/seedance-2.5", prompt, seconds: 5, resolution: "720p", aspect_ratio: "9:16" },
			{ idempotencyKey: request.headers.get("Idempotency-Key") ?? undefined },
		);
		return Response.json({ id: generation.id, status: generation.status, credits: generation.credits_charged }, { status: 201 });
	} catch (error) {
		return failure(error);
	}
}

export async function GET(request: Request) {
	const id = new URL(request.url).searchParams.get("id");
	if (!id) return Response.json({ code: "ID_REQUIRED" }, { status: 400 });
	try {
		const generation = await cutpro.generations.get(id, { wait: 45 });
		return Response.json({ status: generation.status, url: generation.output?.url ?? null, error_code: generation.error_code });
	} catch (error) {
		return failure(error);
	}
}
