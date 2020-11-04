import sys
import datetime
from flask_restful import Api, Resource
from flask import Flask, request, flash, url_for, redirect, render_template
from .models import Keyword, Industry, Sector, Stock, StockKeywords
from .schema import stock_schema, stocks_schema, sector_schema, sectors_schema, industry_schema, \
industries_schema, keyword_schema, keywords_schema
from sqlalchemy.exc import IntegrityError
from app import db

class StockByTickerResource(Resource):
    def get(self, ticker):
        stock = Stock.query.filter(Stock.ticker == ticker).first()
        return stock_schema.dump(stock)

    def delete(self, ticker):
        stock = Stock.query.filter(Stock.ticker == ticker).first()
        if stock:
            db.session.delete(stock)
            db.session.commit()
            return '', 204
        else:
            return '', 404


    def put(self, ticker):
        stock = Stock.query.filter(Stock.ticker == ticker).first()

        keyword_arr = request.json.get('keywords')
        keyword_save_arr = []
        for keyword in keyword_arr:
            keyword_instance = Keyword.query.filter(Keyword.keyword == keyword).first()
            if not keyword_instance:
                keyword_instance = Keyword(keyword=keyword)
                db.session.add(keyword_instance)
            keyword_save_arr.append(keyword_instance)

        sector_id = request.json.get('sector_id')
        sector_instance = None
        if sector_id.strip() != "":
            sector_id = int(sector_id)
            if sector_id >= 0:
                sector_instance = Sector.query.filter(Sector.id == sector_id).first()
                if (not sector_instance):
                    sector_instance = Sector(name=sector_name)
                    db.session.add(sector_instance)
        
        industry_id = request.json.get('industry_id')
        industry_instance = None
        if industry_id.strip() != "":
            industry_id = int(industry_id)
            if industry_id >= 0:
                industry_instance = Industry.query.filter(Industry.id == industry_id, Industry.sector == sector_instance).first()
                if (not industry_instance):
                    industry_instance = Industry(name=industry_name, sector=sector_instance)
                    db.session.add(industry_instance)

        if stock:
            stock.name=request.json.get('name') or None
            stock.description=request.json.get('description') or None
            stock.notes=request.json.get('notes') or None
            stock.ipoyear=request.json.get('ipoyear') or None
            stock.keywords=keyword_save_arr
            stock.sector=sector_instance
            stock.industry=industry_instance
        else:
            stock = Stock(
                ticker=ticker or None,
                exchange=request.json.get('exchange') or None,
                name=request.json.get('name') or None,
                description=request.json.get('description') or None,
                notes=request.json.get('notes') or None,
                ipoyear=request.json.get('ipoyear') or None,
                keywords=keyword_save_arr,
                sector=sector_instance,
                industry=industry_instance
            )
            db.session.add(stock)
        
        db.session.commit()
        return stock_schema.dump(stock)


class StockListBySectorResource(Resource):
    def get(self, sector_id):
        args = request.args
        # default to 50 records per page
        limit = int(args.get('limit', '50'))
        page = int(args.get('page', '1'))
        record_query = Stock.query.filter(Stock.sector_id == sector_id).order_by(Stock.ticker.asc()).paginate(page, limit, False)
        total = record_query.total
        record_items = record_query.items
        return { "total": total, "items": stocks_schema.dump(record_items) }


class StockListByIndustryResource(Resource):
    def get(self, industry_id):
        args = request.args
        limit = int(args.get('limit', '50'))
        page = int(args.get('page', '1'))
        record_query = Stock.query.filter(Stock.industry_id == industry_id).order_by(Stock.ticker.asc()).paginate(page, limit, False)
        total = record_query.total
        record_items = record_query.items
        return { "total": total, "items": stocks_schema.dump(record_items) }

class StockListByKeywordResource(Resource):
    def get(self, keyword_id):
        args = request.args
        limit = int(args.get('limit', '50'))
        page = int(args.get('page', '1'))
        record_query = Stock.query.filter(StockKeywords.keyword_id == keyword_id, StockKeywords.stock_id == Stock.id).order_by(Stock.ticker.asc()).paginate(page, limit, False)
        total = record_query.total
        record_items = record_query.items
        return { "total": total, "items": stocks_schema.dump(record_items) }

class StockListResource(Resource):
    def get(self):
        args = request.args
        # default to 50 records per page
        limit = int(args.get('limit', '50'))
        page = int(args.get('page', '1'))

        # handle filter parameters
        company_name_filter = args.get('companyname', None)
        description_filter = args.get('description', None)
        notes_filter = args.get('notes', None)
        filterobj = None
        filterArray = []

        sector_id = args.get('sector_id')
        if sector_id:
            sector_id = int(sector_id)
            filterArray.append(Stock.sector_id == sector_id)
        
        industry_id = args.get('industry_id')
        if industry_id:
            industry_id = int(industry_id)
            filterArray.append(Stock.industry_id == industry_id)

        keyword_id = args.get('keyword_id')
        if keyword_id:
            keyword_id = int(keyword_id)
            filterArray.append(StockKeywords.keyword_id == keyword_id)
            filterArray.append(StockKeywords.stock_id == Stock.id)

        if company_name_filter:
            filterop, filterval = company_name_filter.split(":")
            if filterop == "like":
                filterobj = Stock.name.like("%{}%".format(filterval))
            elif filterop == "notlike":
                filterobj = ~Stock.name.like("%{}%".format(filterval))
            else:
                return "Unrecognized operation", 404
            filterArray.append(filterobj)

        if description_filter:
            filterop, filterval = description_filter.split(":")
            if filterop == "like":
                filterobj = Stock.description.like("%{}%".format(filterval))
            elif filterop == "notlike":
                filterobj = ~Stock.description.like("%{}%".format(filterval))
            else:
                return "Unrecognized operation", 404
            filterArray.append(filterobj)

        if notes_filter:
            filterop, filterval = notes_filter.split(":")
            if filterop == "like":
                filterobj = Stock.notes.like("%{}%".format(filterval))
            elif filterop == "notlike":
                filterobj = ~Stock.notes.like("%{}%".format(filterval))
            else:
                return "Unrecognized operation", 404
            filterArray.append(filterobj)

        if len(filterArray) > 0:
            record_query = Stock.query
            # run all filters
            for f in filterArray:
                record_query = record_query.filter(f)
            record_query = record_query.order_by(Stock.ticker.asc()).paginate(page, limit, False)
        else:
            record_query = Stock.query.order_by(Stock.ticker.asc()).paginate(page, limit, False)

        total = record_query.total
        record_items = record_query.items
        return { "total": total, "items": stocks_schema.dump(record_items) }

    def post(self):
        ticker = request.json.get('ticker')
        if not ticker:
            return "Ticker symbol must be specified", 400
        existing_stock = Stock.query.filter(Stock.ticker == ticker).first()
        if existing_stock:
            return "Ticker with same symbol already exists", 400
        keyword_arr = request.json.get('keywords')
        if not keyword_arr:
            keyword_arr = []
        keyword_save_arr = []
        for keyword in keyword_arr:
            keyword_instance = Keyword.query.filter(Keyword.keyword == keyword).first()
            if not keyword_instance:
                keyword_instance = Keyword(keyword=keyword)
                db.session.add(keyword_instance)
            keyword_save_arr.append(keyword_instance)

        sector_id = request.json.get('sector_id')
        sector_instance = None
        if sector_id.strip() != "":
            sector_id = int(sector_id)
            if sector_id >= 0:
                sector_instance = Sector.query.filter(Sector.id == sector_id).first()
                if (not sector_instance):
                    sector_instance = Sector(name=sector_name)
                    db.session.add(sector_instance)
        
        industry_id = request.json.get('industry_id')
        industry_instance = None
        if industry_id.strip() != "":
            industry_id = int(industry_id)
            if industry_id >= 0:
                industry_instance = Industry.query.filter(Industry.id == industry_id, Industry.sector == sector_instance).first()
                if (not industry_instance):
                    industry_instance = Industry(name=industry_name, sector=sector_instance)
                    db.session.add(industry_instance)

        new_stock = Stock(
            ticker=ticker or None,
            exchange=request.json.get('exchange') or None,
            name=request.json.get('name') or None,
            description=request.json.get('description') or None,
            notes=request.json.get('notes') or None,
            ipoyear=request.json.get('ipoyear') or None,
            keywords=keyword_save_arr,
            sector=sector_instance,
            industry=industry_instance
        )
        try:
            db.session.add(new_stock)
            db.session.commit()
            return stock_schema.dump(new_stock)
        except IntegrityError:
            return 'Duplicate key error.', 409
        except:
            return 'Database error.', 500

class SectorListResource(Resource):
    def get(self):
        sectors = Sector.query.order_by(Sector.name.asc()).all()
        return sectors_schema.dump(sectors)

class SectorResource(Resource):
    def get(self, sector_id):
        sector = Sector.query.get_or_404(sector_id)
        return sector_schema.dump(sector)

    def delete(self, sector_id):
        sector = Sector.query.get_or_404(sector_id)
        db.session.delete(sector)
        db.session.commit()
        return '', 204

    def post(self):
        name = request.json.get('name', None)
        if name:
            name = name.strip()
        if not name or name == "":
            return 'name must be specified', 400

        try:
            sector_instance = Sector(name=name)
            db.session.add(sector_instance)
            db.session.commit()
            return sector_schema.dump(sector_instance)
        except IntegrityError:
            return 'Duplicate key error.', 409
        except:
            return 'Database error.', 500

class IndustryListResource(Resource):
    def get(self):
        industries = Industry.query.all()
        return industries_schema.dump(industries)

class IndustryResource(Resource):
    def get(self, industry_id):
        industry = Industry.query.get_or_404(industry_id)
        return industry_schema.dump(industry)

    def delete(self, industry_id):
        industry = Industry.query.get_or_404(industry_id)
        db.session.delete(industry)
        db.session.commit()
        return '', 204

    def post(self):
        sector_id = request.json.get('sector_id', None)
        name = request.json.get('name', None)
        if name:
            name = name.strip()
        if not sector_id:
            return 'sector_id must be specified', 404
        elif not name or name == "":
            return 'name must be specified', 404

        sector = Sector.query.filter(Sector.id == sector_id).first()

        if not sector:
            return 'Specified sector does not exist', 404
        else:
            try:
                industry_name = request.json['name']
                industry_instance = Industry(name=industry_name, sector=sector)
                db.session.add(industry_instance)
                db.session.commit()
                return industry_schema.dump(industry_instance)
            except IntegrityError:
                return 'Duplicate key error.', 409
            except:
                return 'Database error.', 500


class KeywordListResource(Resource):
    def get(self):
        keywords = Keyword.query.order_by(Keyword.keyword.asc()).all()
        return keywords_schema.dump(keywords)

    def post(self):
        new_keyword = Keyword(keyword=request.json['keyword'])
        try:
            db.session.add(new_keyword)
            db.session.commit()
            return keyword_schema.dump(new_keyword)
        except IntegrityError:
            return 'Duplicate key error.', 409
        except:
            return 'Database error.', 500

class KeywordResource(Resource):
    def get(self, keyword_id):
        keyword = Keyword.query.get_or_404(keyword_id)
        return keyword_schema.dump(keyword)

    def patch(self, keyword_id):
        keyword = Keyword.query.get_or_404(keyword_id)
        if 'keyword' in request.json:
            keyword.keyword = request.json['keyword']
        db.session.commit()
        return keyword_schema.dump(keyword)

    def delete(self, keyword_id):
        keyword = Keyword.query.get_or_404(keyword_id)
        db.session.delete(keyword)
        db.session.commit()
        return '', 204

