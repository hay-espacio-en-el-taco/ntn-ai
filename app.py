from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
import subprocess

from modal import Image, Stub, asgi_app, Mount

web_app = FastAPI()
stub = Stub(name="ntn-ai")

# image = Image.debian_slim().pip_install("boto3")
image = Image.from_dockerfile("./Dockerfile", context_mount=Mount.from_local_dir("./"), add_python="3.12")

@web_app.post("/medida")
async def foo(request: Request):
    body = await request.json()
    return subprocess.run(["node", "/usr/app/src/app.js", str(body)], stdout=subprocess.PIPE).stdout
    # return body

@stub.function(image=image)
@asgi_app()
def fastapi_app():
    return web_app
