from cutpro import CutPro

cutpro = CutPro()

video = cutpro.generations.generate(
    model="alibaba/wan-3",
    mode="image",
    image_urls=["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Coffee_mug.jpg/1280px-Coffee_mug.jpg"],
    prompt="Steam rises from the coffee mug as the camera slowly pushes in, soft morning light",
    seconds=5,
    resolution="720p",
    aspect_ratio="16:9",
)

print(video["output"]["url"] if video["output"] else None, video["credits_charged"], "credits")
