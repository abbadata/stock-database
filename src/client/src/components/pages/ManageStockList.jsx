import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, Collection, CollectionItem, Icon, Pagination, Collapsible, CollapsibleItem, Toast } from 'react-materialize';
import TickerInputForm from "../parts/TickerInputForm";
import { fetchFilterStocks, deleteStock } from "../util/RestClient";
import { useHistory } from "react-router-dom";
import { PATH_STOCK } from "../../Constants";
import { Link } from 'react-router-dom'
import ErrorDisplay from "../parts/ErrorDisplay";
import PendingDisplay from "../parts/PendingDisplay";
import StockFilter from "../parts/StockFilter";
import FilterDetails from "../parts/FilterDetails";

const ManageStockList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const tickerSymbolOptions = useSelector((state) => state.stockList.tickerSymbolOptions);

    const allStocks = useSelector((state) => state.stockList.list);

    const currentPage = useSelector(state => state.stockList.currentPage);
    const currentLimit = useSelector(state => state.stockList.currentLimit);

    const currentIndustryId = useSelector(state => state.stockList.current.industryId);
    const currentSectorId = useSelector(state => state.stockList.current.sectorId);
    const currentKeywordId = useSelector(state => state.stockList.current.keywordId);
    const currentDescriptionOperation = useSelector(state => state.stockList.current.descriptionOperation);
    const currentDescriptionText = useSelector(state => state.stockList.current.description);
    const currentNotesOperation = useSelector(state => state.stockList.current.notesOperation)
    const currentNotesText = useSelector(state => state.stockList.current.notes)
    const currentCompanyNameOperation = useSelector(state => state.stockList.current.companyNameOperation);
    const currentCompanyNameText = useSelector(state => state.stockList.current.companyName);

    const totalNumItems = useSelector(state => state.stockList.total);

    const stockListErrors = useSelector(state => state.stockList.error);
    const notFoundMessage = useSelector(state => state.stock.notFoundMessage);


    useEffect(() => {
        fetchFilterStocks({
            dispatch,
            currentLimit,
            currentPage,
            sectorId: currentSectorId,
            industryId: currentIndustryId,
            keywordId: currentKeywordId,
            companyName: currentCompanyNameText,
            companyNameOperation: currentCompanyNameOperation,
            description: currentDescriptionText,
            descriptionOperation: currentDescriptionOperation,
            notes: currentNotesText,
            notesOperation: currentNotesOperation,
        });
    }, [currentPage, currentLimit,
        currentIndustryId, currentSectorId, currentKeywordId, currentDescriptionOperation, currentDescriptionText,
        currentNotesOperation, currentNotesText, currentCompanyNameOperation, currentCompanyNameText]);

    const handleDeleteStock = (ticker) => {
        deleteStock(dispatch, ticker);
    }
    const handleEditStock = (ticker) => {
        dispatch({
            type: "EDIT_STOCK",
            payload: { ticker: ticker }
        });
        history.push(PATH_STOCK + "/" + ticker);
    }

    const handlePagination = (page) => {
        dispatch({ type: "STOCK_CHANGE_PAGINATION", payload: { page: page } });
    }

    const getNotFoundHtml = () => {
        if (notFoundMessage == "") {
            return (<div></div>);
        }
        else {
            return (<div className="inline notfound">{notFoundMessage}</div>);
        }
    }



    let rangeLow = ((currentPage - 1) * currentLimit) + 1;
    let rangeHigh = (currentPage * currentLimit) < totalNumItems ? (currentPage * currentLimit) : totalNumItems;
    if (rangeHigh === 0) rangeLow = 0;
    let numItems = Math.floor(totalNumItems / currentLimit) + 1;

    return (
        <div>
            <PendingDisplay></PendingDisplay>
            <ErrorDisplay error={stockListErrors} handleCloseDialog={() => { dispatch({ type: "CLEAR_ERROR" }) }}></ErrorDisplay>
            <div>
                <div>
                    <TickerInputForm tickerSymbolOptions={tickerSymbolOptions}></TickerInputForm>
                    {getNotFoundHtml()}
                </div>
                <Collapsible accordion={false}>
                    <CollapsibleItem
                        header="Expand Filter Options"
                        node="div"
                    >
                        <StockFilter></StockFilter>
                    </CollapsibleItem>
                </Collapsible>
            </div>
            <FilterDetails></FilterDetails>
            <Pagination
                activePage={currentPage}
                items={numItems}
                maxButtons={8}
                leftBtn={<Icon>chevron_left</Icon>}
                rightBtn={<Icon>chevron_right</Icon>}
                onSelect={handlePagination}
            />
            <Row>
                <Col
                    m={12}
                    s={12}
                    l={6}
                    xl={6}
                >
                    <Collection>
                        <CollectionItem style={{ backgroundColor: "#eeeeee", padding: "0px", width: "100%" }}>
                            <div className="row-item">
                                {rangeLow} - {rangeHigh} of {totalNumItems} results
                            </div>
                        </CollectionItem>
                        {allStocks.map((stock, index) => {
                            let color = "#ffffff";
                            if (index % 2 === 0) {
                                color = "#eeeeee";
                            }
                            return (
                                <div key={index}>
                                    <CollectionItem key={index} style={{ backgroundColor: color, padding: "0px", width: "100%" }}>
                                        <div className="hoverchange row-item">
                                            <div className="ticker-fixed inline nogrow">
                                                {stock.ticker}
                                            </div>
                                            <div className="inline grow">
                                                {stock.name}
                                            </div>
                                            <div className="inline" onClick={() => handleDeleteStock(stock.ticker)}>
                                                <Icon tiny className="buttonhover">
                                                    delete
                                                </Icon>
                                            </div>
                                            <div className="inline" onClick={() => handleEditStock(stock.ticker)}>
                                                <Link to={PATH_STOCK + "/" + stock.ticker} className="navblack">
                                                    <Icon tiny className="buttonhover">
                                                        edit
                                                    </Icon>
                                                </Link>
                                            </div>
                                        </div>
                                    </CollectionItem>
                                </div>
                            );
                        }
                        )}
                    </Collection>
                </Col>
            </Row>
            <Pagination
                activePage={currentPage}
                items={numItems}
                maxButtons={8}
                leftBtn={<Icon>chevron_left</Icon>}
                rightBtn={<Icon>chevron_right</Icon>}
                onSelect={handlePagination}
            />
        </div>
    );
}

export default ManageStockList;
