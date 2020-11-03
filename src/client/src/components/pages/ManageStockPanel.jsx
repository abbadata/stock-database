import React, { Component, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput, Textarea, Select, Chip, Icon } from 'react-materialize';
import { loadStock, fetchAllSectors, saveStock } from "../util/RestClient";
import { useHistory } from "react-router-dom";
import { PATH_STOCKLIST } from "../../Constants";
import ErrorDisplay from "../parts/ErrorDisplay";
import PendingDisplay from "../parts/PendingDisplay";

/*global M*/

// Can take ticker symbol as input
const ManageStockPanel = ({ match: { params } }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const stockError = useSelector(state => state.stock.error);

    const tickerInput = useSelector(state => state.stock.tickerInput);
    const exchangeInput = useSelector(state => state.stock.exchangeInput);
    const nameInput = useSelector(state => state.stock.nameInput);
    const descriptionInput = useSelector(state => state.stock.descriptionInput);
    const notesInput = useSelector(state => state.stock.notesInput);
    const ipoyearInput = useSelector(state => state.stock.ipoyearInput);
    const sectorInput = useSelector(state => state.stock.sectorInput);
    const industryInput = useSelector(state => state.stock.industryInput);
    const keywordSimpleArray = useSelector(state => state.stock.keywordSimpleArray);

    const editTicker = useSelector(state => state.stock.editTicker);

    const allSectors = useSelector(state => state.sector.list);
    const updateMode = useSelector(state => state.stock.updateMode);

    const notFoundMessage = useSelector(state => state.stock.notFoundMessage);

    // Fetch all stocks before page load
    useEffect(() => {
        let ticker = params["ticker"];
        if (ticker == null) {
            ticker = editTicker;
        }
        if (ticker != "") {
            dispatch(editStock(ticker));
        }
        else {
            fetchAllSectors(dispatch);
        }
    }, []);
    useEffect(() => {
        // Need this to resize the textarea if we've dynamically placed content into it
        M.textareaAutoResize(document.querySelector('.materialize-textarea'));
    });

    const handleChangeTicker = (e) => {
        dispatch({
            type: "SET_STOCK_TICKER_VALUE",
            payload: { value: e.target.value.toUpperCase() }
        });
    }
    const handleChangeExchange = (e) => {
        dispatch({
            type: "SET_STOCK_EXCHANGE_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleChangeName = (e) => {
        dispatch({
            type: "SET_STOCK_NAME_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleChangeDescription = (e) => {
        dispatch({
            type: "SET_STOCK_DESCRIPTION_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleChangeNotes = (e) => {
        dispatch({
            type: "SET_STOCK_NOTES_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleChangeIpoyear = (e) => {
        dispatch({
            type: "SET_STOCK_IPOYEAR_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleChangeSector = (e) => {
        dispatch({
            type: "SET_STOCK_SECTOR_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleChangeIndustry = (e) => {
        dispatch({
            type: "SET_STOCK_INDUSTRY_VALUE",
            payload: { value: e.target.value }
        });
    }

    const handleClickSaveStock = () => {
        let stockEntry = document.getElementById('stock-entry').value;
        const stock = {
            "ticker": stockEntry, "exchange": exchangeInput, "name": nameInput,
            "description": descriptionInput, "notes": notesInput, "ipoyear": ipoyearInput,
            "keywords": keywordSimpleArray, "sector_id": sectorInput,
            "industry_id": industryInput
        };
        saveStock(dispatch, stock, { onSuccessHandler: () => { history.push(PATH_STOCKLIST) } });
    }
    const handleClickCancelStock = () => {
        dispatch({
            type: "CANCEL_EDIT_STOCK"
        })
        history.push(PATH_STOCKLIST);
    }

    const editStock = (ticker) => {
        return dispatch => {
            loadStock(dispatch, ticker, {});
        }
    }

    const handleKeywordChipAdd = (e, chip) => {
        let word = chip.firstChild.data;
        dispatch({
            type: "KEYWORD_CHIP_ADD", payload: { word: word }
        })
    }
    const handleKeywordChipDelete = (e, chip) => {
        let word = chip.firstChild.data;
        dispatch({
            type: "KEYWORD_CHIP_DELETE", payload: { word: word }
        })
    }


    let industryListInCurrentSector = [];
    allSectors.forEach((sector, index) => {
        if (sector.id == sectorInput) {
            sector.industries.forEach((industry, index2) => {
                industryListInCurrentSector.push(<option key={index} value={industry.id.toString()}>{industry.name}</option>);
            });
        }
    });

    return (
        <div>
            <PendingDisplay></PendingDisplay>
            <ErrorDisplay error={stockError} handleCloseDialog={() => { dispatch({ type: 'CLEAR_ERROR' }) }}></ErrorDisplay>
            <div className="notfound">{notFoundMessage}</div>
            <div className="ticker-input inline">
                <TextInput id="stock-entry" label="Ticker" onChange={handleChangeTicker} value={tickerInput}></TextInput>
            </div>
            <div className="companyname-input inline">
                <TextInput label="Company Name" onChange={handleChangeName} value={nameInput}></TextInput>
            </div>
            <Textarea
                label="Description"
                data-length={5000}
                onChange={handleChangeDescription}
                value={descriptionInput}
            />
            <Textarea
                label="Notes"
                data-length={5000}
                l={100}
                xl={100}
                onChange={handleChangeNotes}
                value={notesInput}
            />
            <div className="exchange-input inline">
                <Select
                    label="Exchange"
                    multiple={false}
                    onChange={handleChangeExchange}
                    options={{
                        classes: '',
                        dropdownOptions: {
                            alignment: 'left',
                            autoTrigger: true,
                            closeOnClick: true,
                            constrainWidth: true,
                            coverTrigger: true,
                            hover: false,
                            inDuration: 150,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            outDuration: 250
                        }
                    }}
                    value={exchangeInput}
                >
                    <option value=""></option>
                    <option value="NASD">NASD</option>
                    <option value="NYSE">NYSE</option>
                    <option value="AMEX">AMEX</option>
                </Select>
            </div>
            <div className="ipoyear-input inline">
                <TextInput label="IPO Year" onChange={handleChangeIpoyear} value={ipoyearInput === "0" ? "" : ipoyearInput}></TextInput>
            </div>
            <div className="sector-input inline">
                <Select
                    label="Sector"
                    multiple={false}
                    value={sectorInput}
                    onChange={handleChangeSector}
                    options={{
                        classes: '',
                        dropdownOptions: {
                            alignment: 'left',
                            autoTrigger: true,
                            closeOnClick: true,
                            constrainWidth: true,
                            coverTrigger: true,
                            hover: false,
                            inDuration: 150,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            outDuration: 250
                        }
                    }}
                >
                    <option value="0"></option>
                    {allSectors.map((sector, index) => {
                        return (<option key={index} value={sector.id.toString()}>{sector.name}</option>);
                    })}
                </Select>
            </div>
            <div className="industry-input inline">
                <Select
                    label="Industry"
                    multiple={false}
                    value={industryInput}
                    onChange={handleChangeIndustry}
                    options={{
                        classes: '',
                        dropdownOptions: {
                            alignment: 'left',
                            autoTrigger: true,
                            closeOnClick: true,
                            constrainWidth: true,
                            coverTrigger: true,
                            hover: false,
                            inDuration: 150,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            outDuration: 250
                        }
                    }}
                >
                    <option value="0"></option>
                    {industryListInCurrentSector}
                </Select>
            </div>
            <div className="keyword-input">
                <Chip
                    close={false}
                    closeIcon={<Icon className="close">close</Icon>}
                    options={{
                        data: keywordSimpleArray.map(e => { return ({ tag: e }) }),
                        onChipAdd: handleKeywordChipAdd,
                        onChipDelete: handleKeywordChipDelete,
                        placeholder: "Keywords"
                    }}
                />
            </div>
            <br></br>
            <Button
                node="button"
                style={{
                    marginRight: '5px'
                }}
                onClick={handleClickSaveStock}
                className="inline"
            >
                {updateMode === 'EDIT' ? 'SAVE UPDATE' : 'CREATE TICKER'}
            </Button>
            <Button
                node="button"
                style={{
                    marginRight: '5px'
                }}
                onClick={handleClickCancelStock}
                className="waves-red inline"
            >
                Cancel
            </Button>
        </div >
    );
}

export default ManageStockPanel;
