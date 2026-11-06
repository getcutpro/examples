from cutpro import CutPro

cutpro = CutPro()  # reads CUTPRO_API_KEY

video = cutpro.generations.generate(
    model="bytedance/seedance-2.5",
    prompt="A golden retriever surfing a wave at sunset, cinematic, slow motion",
    seconds=5,
    resolution="720p",
    aspect_ratio="16:9",
)

print(video["output"]["url"] if video["output"] else None, video["credits_charged"], "credits")
