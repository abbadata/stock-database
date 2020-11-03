const initialState = {
    pending: 0,
    list: [],
    currentPage: 1,
    currentLimit: 50,
    // filter values for currently rendered stock list
    current: {
        sectorId: -1,
        industryId: -1,
        keywordId: -1,
        notes: "",
        notesOperation: "contains",
        description: "",
        descriptionOperation: "contains",
        companyName: "",
        companyNameOperation: "contains"
    },
    // filter values for controlled components in the filter form
    filter: {
        sectorId: -1,
        industryId: -1,
        keywordId: -1,
        notes: "",
        notesOperation: "contains",
        description: "",
        descriptionOperation: "contains",
        companyName: "",
        companyNameOperation: "contains"
    },
    tickerSymbolOptions: [],
    findTickerInput: "",
    total: 0,
    error: ""
}

export default function stockListReducer(state = initialState, action) {
    switch (action.type) {
        case "CLEAR_ERROR":
            return { ...state, error: "" }
        case "CLEAR_STOCKLIST_FILTER":
            return {
                ...state, currentPage: 1,
                filter: {
                    ...state.filter, sectorId: -1, industryId: -1, keywordId: -1, notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                },
                current: {
                    ...state.current, sectorId: -1, industryId: -1, keywordId: -1, notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                }
            }
        case "SET_FIND_STOCK_TICKER_VALUE":
            return { ...state, findTickerInput: action.payload.value }
        case "ADD_NEW_STOCK":
            return {
                ...state, findTickerInput: ""
            }
        case "SET_STOCKLIST_FILTER_SECTOR_VALUE":
            return { ...state, filter: { ...state.filter, sectorId: action.payload.value } }
        case "SET_STOCKLIST_FILTER_INDUSTRY_VALUE":
            return { ...state, filter: { ...state.filter, industryId: action.payload.value } }
        case "SET_STOCKLIST_FILTER_KEYWORD_VALUE":
            return { ...state, filter: { ...state.filter, keywordId: action.payload.value } }

        case "SET_STOCKLIST_FILTER_NOTES_VALUE":
            return { ...state, filter: { ...state.filter, notes: action.payload.value } }
        case "SET_STOCKLIST_FILTER_NOTES_OPERATION":
            return { ...state, filter: { ...state.filter, notesOperation: action.payload.value } }
        case "SET_STOCKLIST_FILTER_DESCRIPTION_VALUE":
            return { ...state, filter: { ...state.filter, description: action.payload.value } }
        case "SET_STOCKLIST_FILTER_DESCRIPTION_OPERATION":
            return { ...state, filter: { ...state.filter, descriptionOperation: action.payload.value } }
        case "SET_STOCKLIST_FILTER_COMPANYNAME_VALUE":
            return { ...state, filter: { ...state.filter, companyName: action.payload.value } }
        case "SET_STOCKLIST_FILTER_COMPANYNAME_OPERATION":
            return { ...state, filter: { ...state.filter, companyNameOperation: action.payload.value } }
        case "CLEAR_FILTER_VALUES": // Clear filter values, but don't change existing stock list
            return {
                ...state,
                filter: {
                    ...state.filter, sectorId: "-1", industryId: -1, keywordId: -1, notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                }
            }
        case "STOCK_CHANGE_PAGINATION":
            // don't allow us to go past the last page.
            let page = action.payload.page;
            let maxpage = Math.floor(state.total / state.currentLimit) + 1;
            if (page > maxpage) page = maxpage;
            return { ...state, currentPage: page };
        case "SWITCH_TO_STOCKLIST_BY_INDUSTRY": //clicking on stocklist button for a particular industry
            return {
                ...state,
                currentPage: 1,
                findTickerInput: "",
                filter: {
                    ...state.filter, sectorId: action.payload.sectorId, industryId: action.payload.industryId, keywordId: -1,
                    notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                },
                current: {
                    ...state.current, sectorId: action.payload.sectorId, industryId: action.payload.industryId, keywordId: -1,
                    notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                }
            }
        case "SWITCH_TO_STOCKLIST_BY_SECTOR": //clicking on stocklist button for a particular sector
            return {
                ...state, currentPage: 1,
                findTickerInput: "",
                filter: {
                    ...state.filter, sectorId: action.payload.sectorId, industryId: -1, keywordId: -1,
                    notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                },
                current: {
                    ...state.current, industryId: -1, sectorId: action.payload.sectorId, keywordId: -1,
                    notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                }
            }
        case "SWITCH_TO_STOCKLIST_BY_KEYWORD": //clicking on stocklist button for a keyword
            return {
                ...state, currentPage: 1,
                findTickerInput: "",
                filter: {
                    ...state.filter, sectorId: -1, industryId: -1, keywordId: action.payload.keywordId,
                    notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                },
                current: {
                    ...state.current, industryId: -1, sectorId: -1, keywordId: action.payload.keywordId,
                    notes: "", notesOperation: "contains",
                    description: "", descriptionOperation: "contains", companyName: "", companyNameOperation: "contains"
                }
            }
        case "LOAD_STOCK_SUCCESS":
            return {
                ...state, findTickerInput: ""
            }
        case "EXECUTE_FILTER":
            return {
                ...state, current: { ...state.filter }
            }
        case "FETCH_ALL_STOCKS_SUCCESS":
            let stocks = action.payload.stocks;
            let total = action.payload.total;
            return {
                ...state, list: stocks, total: total, pending: 0,
                current: { ...state.filter }
            }
        case "FETCH_ALL_STOCKS_PENDING":
            return { ...state, pending: 1 }
        case "FETCH_ALL_STOCKS_FAILURE":
            return { ...state, pending: 0, error: action.payload.error }
        default:
            return state;
    }
}
