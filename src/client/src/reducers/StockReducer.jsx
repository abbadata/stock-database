const initialState = {
    pending: 0,
    editTicker: "",
    tickerInput: "",
    exchangeInput: "",
    nameInput: "",
    descriptionInput: "",
    notesInput: "",
    ipoyearInput: "",
    sectorInput: "",
    industryInput: "",
    keywordSimpleArray: [],
    error: "",
    notFoundMessage: "",
    updateMode: 'ADD' // Can be ADD or EDIT
}

export default function stockReducer(state = initialState, action) {
    switch (action.type) {
        case "CLEAR_ERROR":
            return { ...state, error: "" }
        case "FETCH_ALL_STOCKS_SUCCESS":
        case "SET_FIND_STOCK_TICKER_VALUE":
            return {
                ...state, notFoundMessage: ""
            }
        case "ADD_NEW_STOCK":
            return {
                ...state, updateMode: 'ADD', editTicker: "", notFoundMessage: ""
            }

        case "EDIT_STOCK":
            let ticker = action.payload.ticker;
            return { ...state, editTicker: ticker, updateMode: 'EDIT' }
        case "SET_STOCK_TICKER_VALUE":
            return { ...state, tickerInput: action.payload.value }
        case "SET_STOCK_EXCHANGE_VALUE":
            return { ...state, exchangeInput: action.payload.value }
        case "SET_STOCK_NAME_VALUE":
            return { ...state, nameInput: action.payload.value }
        case "SET_STOCK_DESCRIPTION_VALUE":
            return { ...state, descriptionInput: action.payload.value }
        case "SET_STOCK_NOTES_VALUE":
            return { ...state, notesInput: action.payload.value }
        case "SET_STOCK_IPOYEAR_VALUE":
            return { ...state, ipoyearInput: action.payload.value }
        case "SET_STOCK_SECTOR_VALUE":
            return { ...state, sectorInput: action.payload.value }
        case "SET_STOCK_INDUSTRY_VALUE":
            return { ...state, industryInput: action.payload.value }

        case "KEYWORD_CHIP_ADD":
            return { ...state, keywordSimpleArray: [...state.keywordSimpleArray, action.payload.word] }
        case "KEYWORD_CHIP_DELETE":
            return { ...state, keywordSimpleArray: state.keywordSimpleArray.filter(e => { return (e !== action.payload.word) }) }
        case "ADD_STOCK_PENDING":
            return { ...state, pending: 1, error: "" }
        case "ADD_STOCK_SUCCESS":
            return { ...state, pending: 0, error: "" }
        case "LOAD_STOCK_SUCCESS":
            let data = action.payload.stockdetails;
            return {
                ...state,
                tickerInput: data.ticker ?? "", exchangeInput: data.exchange ?? "",
                descriptionInput: data.description ?? "", nameInput: data.name ?? "", notesInput: data.notes ?? "",
                sectorInput: (data.sector ?? "-1").toString(), industryInput: (data.industry ?? "-1").toString(),
                keywordSimpleArray: data.keywordSimpleArray,
                ipoyearInput: (data.ipoyear ?? "").toString(), error: "",
                editTicker: data.ticker,
                notFoundMessage: "", updateMode: 'EDIT'
            }
        case "LOAD_STOCK_FAILURE":
            return {
                ...state, error: action.payload.error, pending: 0, notFoundMessage: ""
            }
        case "STOCK_NOT_FOUND":
            return {
                ...state, notFoundMessage: action.payload.message
            }

        case "SAVE_STOCK_PENDING":
            return { ...state, pending: 1 }
        case "SAVE_STOCK_SUCCESS":
            {
                let data = action.payload.stockdetails;
                return {
                    ...state, pending: 0,
                    tickerInput: "", exchangeInput: "",
                    descriptionInput: "", nameInput: "", notesInput: "",
                    sectorInput: "-1", industryInput: "-1",
                    keywordSimpleArray: [],
                    ipoyearInput: "", error: "",
                    editTicker: "",
                    updateMode: 'ADD'
                }
            }
        case "SAVE_STOCK_FAILURE":
            return { ...state, error: action.payload.error, pending: 0 }
        case "CANCEL_EDIT_STOCK":
            return {
                ...state,
                tickerInput: "", exchangeInput: "",
                descriptionInput: "", nameInput: "", notesInput: "",
                sectorInput: "-1", industryInput: "-1",
                keywordSimpleArray: [],
                ipoyearInput: "", error: "",
                editTicker: "",
                updateMode: 'ADD'
            }
        default:
            return state;
    }

}
