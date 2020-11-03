from flask import Flask, request, flash, url_for, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from flask_cors import CORS

app = Flask(__name__)

app.config.from_object('config')
cors = CORS(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)

db.create_all()

from .routes import initialize_routes
initialize_routes(api)
