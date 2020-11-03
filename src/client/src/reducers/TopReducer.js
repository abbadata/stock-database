import { combineReducers } from 'redux'
import keywordReducer from "./KeywordReducer";
import sectorReducer from "./SectorReducer";
import industryReducer from "./IndustryReducer";
import stockListReducer from "./StockListReducer";
import stockReducer from "./StockReducer";

const topReducer = combineReducers({
    keyword: keywordReducer,
    stockList: stockListReducer,
    stock: stockReducer,
    sector: sectorReducer,
    industry: industryReducer
})

export default topReducer;
