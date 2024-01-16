# main.py
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from views import router as views_router
from views import router as fastapi_views_router

app = FastAPI()

# Connect the views router
app.include_router(views_router)

# Connect the FastAPI views router
app.include_router(fastapi_views_router, prefix="/fastapi")

# Configure Jinja2Templates
templates = Jinja2Templates(directory="templates")

# Serve static files (CSS, JavaScript, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Home route
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
