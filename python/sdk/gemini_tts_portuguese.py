import urllib.request

from cutpro import CutPro

cutpro = CutPro()

voices = cutpro.models.list(id="google/gemini-3.1-flash-tts")["models"][0]["voices"]
print("Voices:", ", ".join(f"{voice['id']} ({voice['gender']})" for voice in voices))

voice = cutpro.generations.generate(
    model="google/gemini-3.1-flash-tts",
    voice="Kore",
    prompt="Olá! Este vídeo foi feito com inteligência artificial pela Cut.Pro. Bem-vindo ao futuro da criação de conteúdo.",
)

urllib.request.urlretrieve(cutpro.generations.download(voice["id"])["url"], "voice.mp3")
print(f"Saved voice.mp3 ({voice['credits_charged']} credits)")
