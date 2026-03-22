from fastapi import FastAPI

app = FastAPI(title="SUA - Project Service")

@app.get("/")
def read_root():
    return {"message": "Project Service API is running"}
