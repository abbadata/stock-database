from dotenv import load_dotenv
load_dotenv()
import os
from app import app


app.run(host=os.getenv("FLASK_HOST"), port=os.environ.get(
    'PORT', os.getenv("FLASK_PORT")), debug=True)
