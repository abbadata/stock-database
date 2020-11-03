import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'react-materialize';
import SectorIndustryPicker from './SectorIndustryPicker';
import KeywordFilter from "./KeywordFilter";
import ContainsNotContainsFilter from "./ContainsNotContainsFilter";
import { fetchFilterStocks } from "../util/RestClient";

const StockFilter = () => {
    const dispatch = useDispatch();
    const filterSectorId = useSelector(state => state.stockList.filter.sectorId);
    const filterIndustryId = useSelector(state => state.stockList.filter.industryId);
    const filterKeywordId = useSelector(state => state.stockList.filter.keywordId);

    const filterDescriptionOperation = useSelector(state => state.stockList.filter.descriptionOperation);
    const filterDescriptionText = useSelector(state => state.stockList.filter.description);
    const filterNotesOperation = useSelector(state => state.stockList.filter.notesOperation)
    const filterNotesText = useSelector(state => state.stockList.filter.notes)
    const filterCompanyNameOperation = useSelector(state => state.stockList.filter.companyNameOperation);
    const filterCompanyNameText = useSelector(state => state.stockList.filter.companyName);

    const handleFilterChangeSector = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_SECTOR_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleFilterChangeIndustry = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_INDUSTRY_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleFilterKeywordChange = (e) => {
        dispatch({ type: "SET_STOCKLIST_FILTER_KEYWORD_VALUE", payload: { value: e.target.value } });
    }


    const handleFilterChangeCompanyName = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_COMPANYNAME_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleFilterChangeCompanyNameOperation = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_COMPANYNAME_OPERATION",
            payload: { value: e.target.value }
        });
    }

    const handleFilterChangeDescription = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_DESCRIPTION_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleFilterChangeDescriptionOperation = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_DESCRIPTION_OPERATION",
            payload: { value: e.target.value }
        });
    }

    const handleFilterChangeNotes = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_NOTES_VALUE",
            payload: { value: e.target.value }
        });
    }
    const handleFilterChangeNotesOperation = (e) => {
        dispatch({
            type: "SET_STOCKLIST_FILTER_NOTES_OPERATION",
            payload: { value: e.target.value }
        });
    }

    const handleClickFilter = () => {
        dispatch({ type: "EXECUTE_FILTER" })
    }

    const handleClickClear = () => {
        dispatch({ type: "CLEAR_FILTER_VALUES" });
    }

    return (
        <div>
            <div>
                <div className="filter-label inline">Company Name:</div>
                <ContainsNotContainsFilter textValue={filterCompanyNameText} handleOnChangeOperation={handleFilterChangeCompanyNameOperation} handleOnChange={handleFilterChangeCompanyName}></ContainsNotContainsFilter>
            </div>
            <div>
                <div className="filter-label inline">Description:</div>
                <ContainsNotContainsFilter textValue={filterDescriptionText} handleOnChangeOperation={handleFilterChangeDescriptionOperation} handleOnChange={handleFilterChangeDescription}></ContainsNotContainsFilter>
            </div>
            <div>
                <div className="filter-label inline">Notes:</div>
                <ContainsNotContainsFilter textValue={filterNotesText} handleOnChangeOperation={handleFilterChangeNotesOperation} handleOnChange={handleFilterChangeNotes}></ContainsNotContainsFilter>
            </div>
            <div>
                <div className="filter-label inline">Sector/Industry:</div>
                <SectorIndustryPicker
                    inputSectorId={filterSectorId}
                    inputIndustryId={filterIndustryId}
                    changeSectorHandler={handleFilterChangeSector}
                    changeIndustryHandler={handleFilterChangeIndustry}>
                </SectorIndustryPicker>
            </div>
            <div>
                <div className="filter-label inline">Keyword:</div>
                <KeywordFilter keywordId={filterKeywordId} handleKeywordChange={handleFilterKeywordChange}></KeywordFilter>
            </div>
            <div>
                <Button
                    node="button"
                    style={{
                        marginRight: '5px'
                    }}
                    className="inline"
                    onClick={handleClickFilter}
                    tooltipOptions={{}}
                >
                    Filter
                </Button>
                <Button
                    node="button"
                    style={{
                        marginRight: '5px'
                    }}
                    className="inline"
                    onClick={handleClickClear}
                >
                    Clear
                </Button>
            </div>
        </div>
    )
}

export default StockFilter;
