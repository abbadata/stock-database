from .resources import StockByTickerResource, StockListResource, StockListBySectorResource, StockListByIndustryResource, \
StockListByKeywordResource, SectorListResource, SectorResource, IndustryListResource, IndustryResource, \
KeywordListResource, KeywordResource

def initialize_routes(api):
   api.add_resource(StockByTickerResource, '/stocks/ticker/<string:ticker>')

   api.add_resource(StockListResource, '/stocks')
   api.add_resource(StockListBySectorResource, '/stocks/sector/<int:sector_id>')
   api.add_resource(StockListByIndustryResource, '/stocks/industry/<int:industry_id>')
   api.add_resource(StockListByKeywordResource, '/stocks/keyword/<int:keyword_id>')

   api.add_resource(SectorListResource, '/sectors')
   api.add_resource(SectorResource, '/sector/<int:sector_id>', endpoint="sector_with_id")
   api.add_resource(SectorResource, '/sector', endpoint="sector_no_id")

   api.add_resource(IndustryListResource, '/industries')
   api.add_resource(IndustryResource, '/industry/<int:industry_id>', endpoint="industry_with_id")
   api.add_resource(IndustryResource, '/industry', endpoint="industry_no_id")

   api.add_resource(KeywordListResource, '/keywords')
   api.add_resource(KeywordResource, '/keyword/<int:keyword_id>')
