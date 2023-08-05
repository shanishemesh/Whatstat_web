# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from typing import Any
from firebase_functions import https_fn
from firebase_admin import initialize_app
from whatstat import run_file_process
import sys
from pathlib import Path

sys.path.insert(0, Path(__file__).parent.as_posix())

initialize_app()


@https_fn.on_call(max_instances=10)
def run_file_process_on_call(req: https_fn.CallableRequest) -> Any:
    try:
        run_file_process()
        return "success"
    except Exception as err:
        return "error"
    

@https_fn.on_request(max_instances=10)
def run_file_process_on_request(req: https_fn.Request) -> https_fn.Response:
    try:
        run_file_process()
        return https_fn.Response({"code": 200})
    except Exception as err:
        return https_fn.Response({"code": 500,"error": err})
    
