import { CutPro } from "@cutpro/sdk";

const cutpro = new CutPro(); // reads CUTPRO_API_KEY

const video = await cutpro.generations.generate({
	model: "bytedance/seedance-2.5",
	prompt: "A golden retriever surfing a wave at sunset, cinematic, slow motion",
	seconds: 5,
	resolution: "720p",
	aspect_ratio: "16:9",
});

console.log(video.output?.url, `${video.credits_charged} credits`);
