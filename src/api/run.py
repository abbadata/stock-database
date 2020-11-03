from dotenv import load_dotenv
load_dotenv()
from app import app
import os

app.run(host=os.getenv("FLASK_HOST"), port=os.getenv("FLASK_PORT"), debug=True)
