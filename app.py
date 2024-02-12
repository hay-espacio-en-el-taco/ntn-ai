from fastapi import FastAPI, Request, Response
from fastapi.encoders import jsonable_encoder
import json
import subprocess

from modal import Image, Stub, asgi_app, Mount, Secret

web_app = FastAPI()
stub = Stub(name="ntn-ai")

image = Image.from_dockerfile("./Dockerfile", context_mount=Mount.from_local_dir("./"), add_python="3.12")

@web_app.post("/interactions")
async def foo(request: Request):
    body = await request.body()
    headers = json.dumps(jsonable_encoder(request.headers))
    subprocess.run(["npm", "start", body, headers])
    
    f = open("result.json", "r")
    result = f.read()
    f.close()

    parsedResult = json.loads(result)

    if hasattr(parsedResult, 'error'):
        return Response(content='Bad request signature', status_code='401')
    else:
        return Response(content=result, media_type="application/json")

@stub.function(image=image, secrets=[Secret.from_name("NTN ai")])
@asgi_app()
def bot():
    return web_app
