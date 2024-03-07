import json
import subprocess
from fastapi import Request, Response
from fastapi.encoders import jsonable_encoder
from modal import Image, Stub, web_endpoint, Mount, Secret

image = Image.from_dockerfile("./Dockerfile", context_mount=Mount.from_local_dir("./"), add_python="3.12")
stub = Stub(name="ntn-ai", image=image)

@stub.function(secrets=[Secret.from_name("NTN ai")], keep_warm=1)
@web_endpoint(method="POST")
async def interactions(request: Request):
    body = await request.body()
    headers = json.dumps(jsonable_encoder(request.headers))
    subprocess.run(["npm", "start", body, headers])
    
    f = open("result.json", "r")
    result = f.read()
    f.close()
    parsedResult = json.loads(result)

    if 'error' in parsedResult:
        return Response(content='Bad request signature', status_code=401)
    
    if 'deferred' in parsedResult:
        subprocess.Popen(["npm", "run", "discord:deferred", body, headers])
        return Response(content=parsedResult.get('deferred'), media_type="application/json")
    
    return Response(content=result, media_type="application/json")
