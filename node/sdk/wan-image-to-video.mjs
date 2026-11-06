import { CutPro } from "@cutpro/sdk";

const cutpro = new CutPro();

const video = await cutpro.generations.generate({
	model: "alibaba/wan-3",
	mode: "image",
	image_urls: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Coffee_mug.jpg/1280px-Coffee_mug.jpg"],
	prompt: "Steam rises from the coffee mug as the camera slowly pushes in, soft morning light",
	seconds: 5,
	resolution: "720p",
	aspect_ratio: "16:9",
});

console.log(video.output?.url, `${video.credits_charged} credits`);
