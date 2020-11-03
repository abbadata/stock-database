from app import ma
from .models import Industry, Sector, Keyword, Stock

class IndustrySchema(ma.SQLAlchemySchema):
    class Meta:
        model = Industry
    id = ma.auto_field()
    name = ma.auto_field()
    detail = True
    if detail:
        sector = ma.auto_field()
    else:
        sector = ma.HyperlinkRelated("sectorresource", "sector_id")
    # commenting out because of performance impact
    # stocks = ma.List(ma.HyperlinkRelated("stocklistresource"))

industry_schema = IndustrySchema()
industries_schema = IndustrySchema(many=True)

class SectorSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Sector
        #fields = ("id", "name")
    id = ma.auto_field()
    name = ma.auto_field()
    #industries = ma.auto_field()
    #industries = ma.List(ma.HyperlinkRelated("industryresource", "industry_id"))
    industries = ma.Nested(industries_schema)
    # commenting out because of performance impact
    #stocks = ma.List(ma.HyperlinkRelated("stocklistresource"))

sector_schema = SectorSchema()
sectors_schema = SectorSchema(many=True)


class KeywordSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Keyword

    id = ma.auto_field()
    stocks = ma.auto_field()
    keyword = ma.auto_field()

keyword_schema = KeywordSchema()
keywords_schema = KeywordSchema(many=True)


class StockSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Stock

    id = ma.auto_field()
    ticker = ma.auto_field()
    exchange = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    notes = ma.auto_field()
    ipoyear = ma.auto_field()
    creationdate = ma.auto_field()
    updatedate = ma.auto_field()
    sector = ma.auto_field()
    industry = ma.auto_field()

    keywords = ma.Nested(keywords_schema, exclude=("stocks",))


stock_schema = StockSchema()
stocks_schema = StockSchema(many=True)

