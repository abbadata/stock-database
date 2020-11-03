const initialState = {
    pending: 0,
    list: [], // this just stores the response.data from the REST server as-is (for all sectors)
    input: "",
    addSectorId: -1,
    addSectorInput: "",
    addIndustryInput: "",
    numChanges: 0, // makes component reload after any changes
    error: ""
}

export default function sectorReducer(state = initialState, action) {
    switch (action.type) {
        case "CLEAR_ERROR":
            return { ...state, error: "" }

        // User clicks on "Add Industry". Sector is passed in
        case "TURN_ON_ADD_INDUSTRY":
            return {
                ...state, addSectorId: action.payload.id
            }
        case "TURN_OFF_ADD_INDUSTRY":
            return {
                ...state, addSectorId: -1, addIndustryInput: ""
            }

        case "SET_ADD_INDUSTRY_INPUT":
            return {
                ...state, addIndustryInput: action.payload.value, error: ""
            }

        case "SAVE_INDUSTRY_SUCCESS":
            return {
                ...state, numChanges: state.numChanges + 1, addSectorId: -1, addIndustryInput: ""
            }
        case "ADD_SECTOR_SUCCESS":
            return {
                ...state, numChanges: state.numChanges + 1, input: ""
            }
        case "ADD_SECTOR_PENDING":
            return {
                ...state, pending: 1
            }
        case "ADD_SECTOR_FAILURE":
            return {
                ...state, pending: 0, error: action.payload.error
            }
        case "DELETE_SECTOR_SUCCESS":
            return {
                ...state, numChanges: state.numChanges + 1
            }
        case "DELETE_SECTOR_PENDING":
            return {
                ...state, pending: 1
            }
        case "DELETE_SECTOR_FAILURE":
            return {
                ...state, pending: 0, error: action.payload.error
            }

        case "FETCH_ALL_SECTORS_PENDING":
            return { ...state, pending: 1 }
        case "FETCH_ALL_SECTORS_SUCCESS":
            return { ...state, list: action.payload.sectors, pending: 0 }
        case "FETCH_ALL_SECTORS_FAILURE":
            return { ...state, pending: 0, error: action.payload.error }
        case "SET_SECTOR_VALUE":
            return { ...state, input: action.payload.value }

        case "DELETE_INDUSTRY_SUCCESS":
            return {
                ...state, numChanges: state.numChanges + 1, addSectorId: -1, addIndustryInput: ""
            }
        default:
            return state;
    }
}
