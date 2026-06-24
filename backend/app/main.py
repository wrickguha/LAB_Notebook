from fastapi import FastAPI

app = FastAPI(
    title="Lab Notebook"
)

@app.get("/")
async def root():
    return {"message": "Lab Notebook API is running!"}
