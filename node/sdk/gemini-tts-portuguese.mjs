import { writeFile } from "node:fs/promises";
import { CutPro } from "@cutpro/sdk";

const cutpro = new CutPro();

const { models } = await cutpro.models.list({ id: "google/gemini-3.1-flash-tts" });
console.log("Voices:", models[0]?.voices.map((voice) => `${voice.id} (${voice.gender ?? "?"})`).join(", "));

const voice = await cutpro.generations.generate({
	model: "google/gemini-3.1-flash-tts",
	voice: "Kore",
	prompt: "Olá! Este vídeo foi feito com inteligência artificial pela Cut.Pro. Bem-vindo ao futuro da criação de conteúdo.",
});

const { url } = await cutpro.generations.download(voice.id);
await writeFile("voice.mp3", new Uint8Array(await (await fetch(url)).arrayBuffer()));
console.log(`Saved voice.mp3 (${voice.credits_charged} credits)`);
