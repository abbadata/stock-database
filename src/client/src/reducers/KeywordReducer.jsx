const initialState = {
    pending: 0,
    keywords: [],
    keywordText: "",
    fetchKeywordsPending: 0,
    addKeywordPending: 0,
    deleteKeywordPending: 0,
    toDeleteId: -1,
    error: "",
    confirm: 0
}

export default function keywordReducer(state = initialState, action) {
    switch (action.type) {
        case "CLEAR_ERROR":
            return { ...state, error: "" }

        case "SET_KEYWORD_VALUE":
            return { ...state, keywordText: action.payload.value }
        case "ADD_KEYWORD_PENDING":
            return { ...state, pending: 0 }
        case "ADD_KEYWORD_SUCCESS":
            return { ...state, keywords: [...state.keywords, action.payload.keyword], pending: 0, keywordText: "" }
        case "ADD_KEYWORD_FAILURE":
            return { ...state, pending: 0, error: action.payload.error }

        case "DELETE_KEYWORD_PENDING":
            return { ...state, pending: 1 }
        case "DELETE_KEYWORD_SUCCESS":
            let keywords = state.keywords.filter((k) => { return k.id !== action.payload.keywordId; })
            return { ...state, keywords: keywords, pending: 0, toDeleteId: -1 }
        case "DELETE_KEYWORD_FAILURE":
            return { ...state, pending: 0, error: action.payload.error, toDeleteId: -1 }

        case "FETCH_ALL_KEYWORDS_PENDING":
            return { ...state, pending: 1 }
        case "FETCH_ALL_KEYWORDS_SUCCESS":
            return { ...state, keywords: action.payload.keywords, pending: 0 }

        case "REQUEST_CONFIRM_DELETE":
            return { ...state, confirm: 1, toDeleteId: action.payload.keywordId }
        case "CANCEL_DELETE":
            return { ...state, confirm: 0, toDeleteId: -1 }
        default:
            return state;
    }
}
