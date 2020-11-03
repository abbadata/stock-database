const initialState = {
    pending: 0,
    list: [],
    input: "",
    error: ""
}

export default function industryReducer(state = initialState, action) {
    switch (action.type) {
        case "CLEAR_ERROR":
        // User clicks on "Add Industry". Sector is passed in
        case "SET_ADD_INDUSTRY_INPUT":
        case "TURN_ON_ADD_INDUSTRY":
        case "TURN_OFF_ADD_INDUSTRY":
            return { ...state, error: "" }

        case "SAVE_INDUSTRY_SUCCESS":
            return { ...state, pending: 0, error: "" }
        case "SAVE_INDUSTRY_PENDING":
            return { ...state, pending: 1, error: "" }
        case "SAVE_INDUSTRY_FAILURE":
            return { ...state, pending: 0, error: action.payload.error }
        case "DELETE_INDUSTRY_SUCCESS":
            return { ...state, pending: 0, error: "" }
        case "DELETE_INDUSTRY_FAILURE":
            return { ...state, pending: 0, error: action.payload.error }
        case "DELETE_INDUSTRY_PENDING":
            return { ...state, pending: 1, error: "" }
        case "FETCH_ALL_INDUSTRIES_PENDING":
            return { ...state, pending: 1 }
        case "FETCH_ALL_INDUSTRIES_SUCCESS":
            return { ...state, list: action.payload.industries, pending: 0 }
        case "SET_INDUSTRY_VALUE":
            return { ...state, input: action.payload.value }
        default:
            return state;
    }
}
