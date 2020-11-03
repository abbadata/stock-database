import React from "react";
import { useSelector, useDispatch } from "react-redux";
import 'materialize-css';
import { Button, TextInput } from 'react-materialize';
import { loadStock } from "../util/RestClient";
import { useHistory } from "react-router-dom";
import { PATH_STOCK } from "../../Constants";


const TickerInputForm = ({ tickerSymbolOptions }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const tickerInput = useSelector(state => state.stockList.findTickerInput);

    const handleClickLoadStock = () => {
        loadStock(dispatch, tickerInput, { onSuccessHandler: () => { history.push(PATH_STOCK) } });
    }

    const handleClickAddNewStock = () => {
        dispatch({ type: "ADD_NEW_STOCK" });
        history.push(PATH_STOCK);
    }

    const handleChangeTicker = (e) => {
        dispatch({
            type: "SET_FIND_STOCK_TICKER_VALUE",
            payload: { value: e.target.value.toUpperCase() }
        });
    }

    return (
        <div>
            <div className="ticker-input inline">
                <TextInput id="stock-entry" label="Ticker" onChange={handleChangeTicker} value={tickerInput}></TextInput>
            </div>
            <Button
                node="button"
                style={{
                    marginRight: '5px'
                }}
                onClick={handleClickLoadStock}
                className="inline"
            >
                FIND
            </Button>
            <Button
                node="button"
                style={{
                    marginRight: '5px'
                }}
                onClick={handleClickAddNewStock}
                className="inline"
            >
                Add New Stock
            </Button>
        </div>
    )
}

export default TickerInputForm;
