import datetime

from app import db

class Sector(db.Model):
    id = db.Column('id', db.Integer, primary_key = True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    industries = db.relationship("Industry", cascade="all,delete-orphan", back_populates="sector", order_by="Industry.name")

    def __repr__(self):
        return '<Sector {name}>'.format(name=self.name)

class Industry(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable=False)
    sector_id = db.Column(db.Integer, db.ForeignKey('sector.id'),
        nullable=False)
    sector = db.relationship("Sector", back_populates="industries")

    def __repr__(self):
        return '<Industry {name}>'.format(name=self.name)

class StockKeywords(db.Model):
    __tablename__ = "stock_keywords"
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'), primary_key=True)
    keyword_id = db.Column(db.Integer, db.ForeignKey('keyword.id'), primary_key=True)



class Keyword(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(50), nullable=False, unique=True)
    stocks = db.relationship('Stock', secondary="stock_keywords", back_populates='keywords')

    def __repr__(self):
        return '<Keyword {keyword}>'.format(keyword=self.keyword)


class Stock(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    ticker = db.Column(db.String(10), unique=True, nullable=False)
    exchange = db.Column(db.String(10))
    name = db.Column(db.String(200))
    description = db.Column(db.String(5000))
    notes = db.Column(db.String(5000))
    ipoyear = db.Column(db.Integer)

    keywords = db.relationship("Keyword", secondary="stock_keywords", back_populates="stocks", order_by="Keyword.keyword")

    creationdate = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updatedate = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    sector_id = db.Column('sector_id', db.Integer, db.ForeignKey('sector.id'),
        nullable=True)
    sector = db.relationship("Sector", backref="stocks")
    
    industry_id = db.Column('industry_id', db.Integer, db.ForeignKey('industry.id'),
        nullable=True)
    industry = db.relationship("Industry", backref="stocks")

    def __repr__(self):
        return '<Stock {ticker}>'.format(ticker=self.ticker)

