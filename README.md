# Cut.Pro API examples: Seedance, Wan, Nano Banana and Gemini TTS in curl, Node, Python, Next.js and n8n

Copy-paste examples for the [Cut.Pro](https://cut.pro) generation API: one key for video, image and voice models (Seedance 2.5, Wan 3, Kling O3, Veo 3.1, Gemini Omni Flash, Nano Banana Pro, Seedream 5, Qwen Image, GPT Image, Grok Imagine, MiniMax and Gemini TTS voices). Priced per second of video, per image or per 1,000 characters of voice, in reais and dollars: see the [live price list](https://cut.pro/en/models). Pay with Pix or card; companies get an invoice.

## Setup

Create a key at [cut.pro/studio/me/api-keys](https://cut.pro/studio/me/api-keys) (every account starts with free credits):

```bash
export CUTPRO_API_KEY="paste_your_key_here"
```

Every example follows the same three steps: get the exact price (`POST /generations/quote`, free), generate with that price (`POST /generations` with `credits`), and wait for the file (`GET /generations/{id}?wait=60`, or a webhook).

## The four examples

| Example | Model | Request body |
|---|---|---|
| Text to video | [Seedance 2.5](https://cut.pro/en/models/seedance-2-5) | [`requests/seedance-2.5-text-to-video.json`](requests/seedance-2.5-text-to-video.json) |
| Image to video | [Wan 3](https://cut.pro/en/models/wan-3) | [`requests/wan-3-image-to-video.json`](requests/wan-3-image-to-video.json) |
| Image with references | [Nano Banana Pro](https://cut.pro/en/models/nano-banana-pro) | [`requests/nano-banana-pro-references.json`](requests/nano-banana-pro-references.json) |
| Voice in Portuguese | [Gemini 3.1 Flash TTS](https://cut.pro/en/models/gemini-3-1-flash-tts) | [`requests/gemini-tts-portuguese.json`](requests/gemini-tts-portuguese.json) |

Seedance 2.5 text to video, the body every language below sends:

```json
{
	"model": "bytedance/seedance-2.5",
	"prompt": "A golden retriever surfing a wave at sunset, cinematic, slow motion",
	"seconds": 5,
	"resolution": "720p",
	"aspect_ratio": "16:9"
}
```

## curl

```bash
./curl/generate.sh requests/seedance-2.5-text-to-video.json
```

[`curl/generate.sh`](curl/generate.sh) quotes, generates with the quoted credits and long-polls until the file is ready (needs `jq`). The raw calls:

```bash
curl -X POST https://api.cut.pro/api/v1/generations/quote \
  -H "X-Api-Key: $CUTPRO_API_KEY" -H "Content-Type: application/json" \
  -d @requests/seedance-2.5-text-to-video.json
# {"credits": 225, ...}

curl -X POST "https://api.cut.pro/api/v1/generations?wait=60" \
  -H "X-Api-Key: $CUTPRO_API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"bytedance/seedance-2.5","prompt":"A golden retriever surfing a wave at sunset","seconds":5,"resolution":"720p","credits":225}'

curl "https://api.cut.pro/api/v1/generations/GENERATION_ID?wait=60" -H "X-Api-Key: $CUTPRO_API_KEY"
```

## Node.js

With `fetch` only (Node 18+, no install): [`node/fetch/generate.mjs`](node/fetch/generate.mjs)

```bash
node node/fetch/generate.mjs requests/wan-3-image-to-video.json
```

With [`@cutpro/sdk`](https://github.com/getcutpro/sdk-js) (`cd node && npm install`):

| File | |
|---|---|
| [`node/sdk/seedance-text-to-video.mjs`](node/sdk/seedance-text-to-video.mjs) | Seedance 2.5 text to video |
| [`node/sdk/wan-image-to-video.mjs`](node/sdk/wan-image-to-video.mjs) | Wan 3 image to video |
| [`node/sdk/nano-banana-references.mjs`](node/sdk/nano-banana-references.mjs) | Nano Banana Pro with two reference images, showing the price first |
| [`node/sdk/gemini-tts-portuguese.mjs`](node/sdk/gemini-tts-portuguese.mjs) | Lists the voices, reads Portuguese text and saves `voice.mp3` |

```js
import { CutPro } from "@cutpro/sdk";

const video = await new CutPro().generations.generate({ model: "bytedance/seedance-2.5", prompt: "A golden retriever surfing a wave at sunset", seconds: 5 });
console.log(video.output?.url);
```

## Python

`pip install -r python/requirements.txt`

With `requests`: [`python/requests/generate.py`](python/requests/generate.py)

```bash
python python/requests/generate.py requests/nano-banana-pro-references.json
```

With the [`cutpro`](https://github.com/getcutpro/sdk-python) package: [`python/sdk/`](python/sdk) has the same four examples (`seedance_text_to_video.py`, `wan_image_to_video.py`, `nano_banana_references.py`, `gemini_tts_portuguese.py`).

```python
from cutpro import CutPro

video = CutPro().generations.generate(model="bytedance/seedance-2.5", prompt="A golden retriever surfing a wave at sunset", seconds=5)
print(video["output"]["url"])
```

## Next.js route handler

[`nextjs/app/api/generations/route.ts`](nextjs/app/api/generations/route.ts): `POST /api/generations` with `{ "prompt": "..." }` starts a Seedance 2.5 video and answers its `id`; `GET /api/generations?id=...` holds up to 45 seconds and answers `status` and `url`. Copy it into `app/api/generations/route.ts`, `npm install @cutpro/sdk`, set `CUTPRO_API_KEY` in the server environment and put your own authentication in front: every POST spends credits. For the Vercel AI SDK, see [`@cutpro/ai-sdk-provider`](https://github.com/getcutpro/ai-sdk-provider).

## n8n

- [`n8n/cutpro-node-workflow.json`](n8n/cutpro-node-workflow.json): the four examples with the [Cut.Pro community node](https://github.com/getcutpro/n8n-nodes-cutpro) (install `n8n-nodes-cutpro` first).
- [`n8n/http-request-workflow.json`](n8n/http-request-workflow.json): Seedance 2.5 with the built-in HTTP Request node only, for n8n Cloud or any instance without community nodes. Create a **Header Auth** credential with name `X-Api-Key` and your key as the value.

In n8n: **Workflows > Import from File**, then pick the credential on each Cut.Pro or HTTP Request node.

## Errors

Every error is `{ "code": "...", "extra": { ... } }`. The ones you will meet first:

| Code | What to do |
|---|---|
| `INSUFFICIENT_CREDITS` | Top up at `extra.top_up_url`. |
| `PRICE_CHANGED` | The price moved since the quote; nothing was charged. The new total is in `extra.credits`. |
| `SECONDS_INVALID`, `RESOLUTION_INVALID`, `RATIO_INVALID` | The model takes the values in `extra.allowed`. |
| `VOICE_INVALID` | Pick a voice from `GET /models?id=<model>` (`voices[].id`). |
| `TOO_MANY_RUNNING` | Wait for one of your generations to end. |

A generation that ends `failed` has the reason in `error_code` and its credits come back on their own. Full list in the [error catalog](https://cut.pro/docs/en/errors).

The sample images are from Wikimedia Commons: [Coffee mug](https://commons.wikimedia.org/wiki/File:Coffee_mug.jpg) and [Coffee table by a wooden wall](https://commons.wikimedia.org/wiki/File:Coffee_table_by_a_wooden_wall_(Unsplash).jpg).

## Em português

Exemplos prontos para copiar da API de geração da Cut.Pro: Seedance 2.5 (texto para vídeo), Wan 3 (imagem para vídeo), Nano Banana Pro (imagem com referências) e voz do Gemini TTS em português, em curl, Node, Python, Next.js e n8n. Uma chave só, preço por segundo de vídeo, por imagem ou por 1.000 caracteres, em reais: [tabela de preços ao vivo](https://cut.pro/pt-BR/models). Pague com Pix ou cartão, com nota fiscal para empresas. Toda conta começa com créditos grátis.

1. Crie a chave em [cut.pro/studio/me/api-keys](https://cut.pro/studio/me/api-keys) e rode `export CUTPRO_API_KEY="sua_chave"`.
2. Rode, por exemplo, `./curl/generate.sh requests/gemini-tts-portuguese.json`: o script mostra o preço, gera e imprime o link do arquivo.
3. Guia completo em português: [cut.pro/docs/generations](https://cut.pro/docs/generations). Páginas dos modelos: [Seedance 2.5](https://cut.pro/pt-BR/models/seedance-2-5), [Wan 3](https://cut.pro/pt-BR/models/wan-3), [Nano Banana Pro](https://cut.pro/pt-BR/models/nano-banana-pro), [Gemini 3.1 Flash TTS](https://cut.pro/pt-BR/models/gemini-3-1-flash-tts).

## License

MIT
