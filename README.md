# Simple Stock Database

A simple responsive stock ticker symbol database.<br>
Demo at http://base.abbadata.com:8000/<br>
I use it to look up stocks quickly based on Sector/Industry, Keywords, notes, and description.

# Installing and Running
## REST API server
```
$ cd src/api
$ python -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```
Edit .env . Set "SQLALCHEMY_DATABASE_URI" to point to your database of choice.<br>
By default, this will refer to a local sqlite database.<br>
FLASK_HOST and FLASK_PORT can be changed as well. By default it runs on port 5000 and binds to all IP addresses of the host.
```
$ python run.py
```
The schema will be created automatically assuming it doesn't exist already.

I'd suggest populating the database automatically by scraping Yahoo finance or some other financial portal.<br>
However, everything can be entered manually as well.

## Web Client (Development)
```
cd src/client
npm install
npm start
```
Should launch in the browser. If not, navigate to: http://localhost:8000/

## Web Client (Production)
```
cd src/client
npm install
npm run build (all assets will be in build/)
```

Note that the web client communicates with the REST server directly from the browser, so make sure the browser can access the server specified
in .env: `REACT_APP_REST_SERVER="http://localhost:5000"`
If Flask is not running at the default location (http://localhost:5000), edit .env to point to the right place before starting/building the web client.


# Fields 
## Keywords

A stock can be associated with one or more keywords. A list of stock
can then be pulled up for each keyword.

## Sector/Industry

An industry belongs to a sector. A stock can be associated with a Sector or a Sector/Industry.

# Implementation Details
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Back-End
The back-end is written as a REST API using Python / Flask / SQLAlchemy.

## Front-End
React / Redux / Materialize
