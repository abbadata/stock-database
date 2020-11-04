import axios from 'axios';

/*
Loads details for a stock using the REST API.
Input format will be like this
{
    "creationdate": "2020-10-27T05:16:39",
    "name": "Test Corporation",
    "notes": "This is a test note",
    "keywords": [
        {
            "id": 4,
            "keyword": "covid"
        },
        {
            "id": 5,
            "keyword": "gold"
        },
        {
            "id": 3,
            "keyword": "iphone"
        }
    ],
    "id": 5600,
    "ticker": "ZZZZZ",
    "sector": 10,
    "exchange": "NYSE",
    "industry": 109,
    "description": "Test Corporation, together with its subsidiaries, produces and sells a lot of different products.",
    "updatedate": "2020-10-27T05:16:39",
    "ipoyear": 2012
}
*/
export const loadStock = (dispatch, ticker, { onSuccessHandler = null, onFailureHandler = null }) => {
    dispatch({ type: "LOAD_STOCK_PENDING" });
    axios.get(process.env.REACT_APP_REST_SERVER + '/stocks/ticker/' + ticker).then(response => {
        let stock = response.data;
        if (Object.keys(stock).length > 0) {
            // convert the json array to a simple array containing the keywords. Remove blanks.
            stock.keywordSimpleArray = stock.keywords.map(e => { return e.keyword; }).filter(e => { return e.trim() !== "" });

            dispatch({ type: "LOAD_STOCK_SUCCESS", payload: { stockdetails: stock } })
            // after loading stock, we need to refetch sectors, otherwise there might be race condition where
            // the SELECT doesn't rerender with the selected value
            fetchAllSectors(dispatch);
            if (onSuccessHandler) onSuccessHandler();
        }
        else {
            dispatch({ type: "STOCK_NOT_FOUND", payload: { message: `Ticker not found: ${ticker}` } });
            //if (onFailureHandler) onFailureHandler();
        }
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "LOAD_STOCK_FAILURE", payload: { error: errortext } });
        if (onFailureHandler) onFailureHandler();
    });
};

export const deleteStock = (dispatch, ticker) => {
    dispatch({ type: "DELETE_STOCK_PENDING" });
    axios.delete(process.env.REACT_APP_REST_SERVER + '/stocks/ticker/' + ticker).then(response => {
        dispatch({ type: "DELETE_STOCK_SUCCESS", payload: { ticker: ticker } });
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "DELETE_STOCK_FAILURE", payload: { error: errortext } });
    });;

}

export const fetchAllSectors = (dispatch) => {
    dispatch({ type: "FETCH_ALL_SECTORS_PENDING" });
    axios.get(process.env.REACT_APP_REST_SERVER + '/sectors').then(response => {
        //let stocks = response.data;
        let sectors = response.data;
        dispatch({ type: "FETCH_ALL_SECTORS_SUCCESS", payload: { sectors: sectors } })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "FETCH_ALL_SECTORS_FAILURE", payload: { error: errortext } });
    });
}

export const fetchFilterStocks = ({ dispatch, sectorId = -1, industryId = -1, keywordId = -1,
    companyName = "", companyNameOperation = "", notes = "", notesOperation = "", description = "", descriptionOperation = "",
    currentLimit = 50, currentPage = 1 }) => {
    dispatch({ type: "FETCH_ALL_STOCKS_PENDING" });
    let url = process.env.REACT_APP_REST_SERVER + "/stocks";
    url += '?limit=' + currentLimit + "&page=" + currentPage;
    if (industryId >= 0) {
        url += "&industry_id=" + industryId;
    }
    if (sectorId >= 0) {
        url += "&sector_id=" + sectorId;
    }
    if (keywordId >= 0) {
        url += "&keyword_id=" + keywordId;
    }
    if (companyName !== "" && companyNameOperation !== "") {
        url += "&companyname=" + (companyNameOperation === "contains" ? "like:" : "notlike:") + companyName;
    }
    if (description !== "" && descriptionOperation !== "") {
        url += "&description=" + (descriptionOperation === "contains" ? "like:" : "notlike:") + description;
    }
    if (notes !== "" && notesOperation !== "") {
        url += "&notes=" + (notesOperation === "contains" ? "like:" : "notlike:") + notes;
    }

    axios.get(url).then(response => {
        dispatch({ type: "FETCH_ALL_STOCKS_SUCCESS", payload: { stocks: response.data.items, total: response.data.total } })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "FETCH_ALL_STOCKS_FAILURE", payload: { error: errortext } });
    });
}

export const fetchAllStocks = (dispatch, currentLimit = 50, currentPage = 1) => {
    dispatch({ type: "FETCH_ALL_STOCKS_PENDING" });
    let url = process.env.REACT_APP_REST_SERVER + "/stocks";
    axios.get(url + '?limit=' + currentLimit + "&page=" + currentPage).then(response => {
        dispatch({ type: "FETCH_ALL_STOCKS_SUCCESS", payload: { stocks: response.data.items, total: response.data.total } })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "FETCH_ALL_STOCKS_FAILURE", payload: { error: errortext } });
    });
}

export const fetchAllKeywords = (dispatch) => {
    dispatch({ type: "FETCH_ALL_KEYWORDS_PENDING" });
    axios.get(process.env.REACT_APP_REST_SERVER + '/keywords').then(response => {
        //let stocks = response.data;
        let keywords = response.data;
        dispatch({ type: "FETCH_ALL_KEYWORDS_SUCCESS", payload: { keywords: keywords } })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "FETCH_ALL_KEYWORDS_FAILURE", payload: { error: errortext } });
    });
}


export const deleteIndustry = (dispatch, industryId) => {
    dispatch({ type: "DELETE_INDUSTRY_PENDING" });
    axios.delete(process.env.REACT_APP_REST_SERVER + '/industry/' + industryId).then(response => {
        dispatch({ type: "DELETE_INDUSTRY_SUCCESS" })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "DELETE_INDUSTRY_FAILURE", payload: { error: errortext } });
    });
}

export const deleteSector = (dispatch, id) => {
    dispatch({ type: "DELETE_SECTOR_PENDING" });
    axios.delete(process.env.REACT_APP_REST_SERVER + '/sector/' + id).then(response => {
        dispatch({ type: "DELETE_SECTOR_SUCCESS", payload: { sectorId: id } })
        fetchAllSectors(dispatch);
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "DELETE_SECTOR_FAILURE", payload: { error: errortext } });
    });
}

export const addSector = (dispatch, sectorText) => {
    const createbody = { name: sectorText };
    dispatch({ type: "ADD_SECTOR_PENDING" });
    axios.post(process.env.REACT_APP_REST_SERVER + '/sector', createbody).then(response => {
        let sector = response.data;
        dispatch({ type: "ADD_SECTOR_SUCCESS", payload: { sector: sector } })
        //fetchAllSectors(dispatch);
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "ADD_SECTOR_FAILURE", payload: { error: errortext } });
    });
}

export const sendSaveIndustry = (dispatch, sectorId, name) => {
    dispatch({ type: "SAVE_INDUSTRY_PENDING" });
    const createbody = {
        "sector_id": sectorId, "name": name
    };
    axios.post(process.env.REACT_APP_REST_SERVER + '/industry', createbody).then(response => {
        dispatch({ type: "SAVE_INDUSTRY_SUCCESS" })
        // this won't actually cause a rerender though. Might be better to do a different way
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "SAVE_INDUSTRY_FAILURE", payload: { error: errortext } });
    });

}

/*
    Saves a new stock

    This is the format of the body of the PUT request:
    { "ticker": "ZZZZ", "exchange": "AMEX", "name": "Test Corporation", "keywords": ["china", "microcap"], 
    "description": "Test Corporation, together with its subsidiaries, produces and sells a lot of different products.",
    "notes": "Company will report earnings on 10/27/2020."
    "ipoyear": "2012", "sector_id": 10, "industry": 109 }
*/
export const saveStock = (dispatch, stock, { onSuccessHandler = null, onFailureHandler = null }) => {
    dispatch({ type: "SAVE_STOCK_PENDING" });
    let ticker = stock.ticker;
    axios.put(process.env.REACT_APP_REST_SERVER + '/stocks/ticker/' + ticker, stock).then(response => {
        let stockdetails = response.data;
        dispatch({ type: "SAVE_STOCK_SUCCESS", payload: { stockdetails: stockdetails } })
        if (onSuccessHandler) onSuccessHandler();
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "SAVE_STOCK_FAILURE", payload: { error: errortext } });
        if (onFailureHandler) onFailureHandler();
    });
}


export const addKeyword = (dispatch, keyword) => {
    dispatch({ type: "ADD_KEYWORD_PENDING" });
    keyword = keyword.trim();
    if (keyword === "") {
        dispatch({ type: "ADD_KEYWORD_FAILURE", payload: { error: "Keyword can not be blank." } });
        return;
    }
    const createbody = { keyword: keyword };
    axios.post(process.env.REACT_APP_REST_SERVER + '/keywords', createbody).then(response => {
        let keyword = response.data;
        dispatch({ type: "ADD_KEYWORD_SUCCESS", payload: { keyword: keyword } })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "ADD_KEYWORD_FAILURE", payload: { error: errortext } });
    });
}

export const deleteKeyword = (dispatch, id) => {
    dispatch({ type: "DELETE_KEYWORD_PENDING" });
    axios.delete(process.env.REACT_APP_REST_SERVER + '/keyword/' + id).then(response => {
        dispatch({ type: "DELETE_KEYWORD_SUCCESS", payload: { keywordId: id } })
    }).catch(error => {
        let errortext = error.response ? `${error.response.status} ${error.response.data}` : error.toString();
        dispatch({ type: "DELETE_KEYWORD_FAILURE", payload: { error: errortext } });
    });
}