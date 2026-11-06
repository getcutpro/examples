from cutpro import CutPro

cutpro = CutPro()

request = dict(
    model="google/nano-banana-pro",
    mode="references",
    image_urls=[
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Coffee_mug.jpg/1280px-Coffee_mug.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Coffee_table_by_a_wooden_wall_%28Unsplash%29.jpg/1280px-Coffee_table_by_a_wooden_wall_%28Unsplash%29.jpg",
    ],
    prompt="Place the mug from the first image on the coffee table from the second image, natural window light, product photo",
    aspect_ratio="4:5",
)

quote = cutpro.generations.quote(**request)
print(f"Price: {quote['credits']} credits")  # ask for a yes here in a real app

image = cutpro.generations.generate(**request, credits=int(quote["credits"]))
print(image["output"]["url"] if image["output"] else None)
