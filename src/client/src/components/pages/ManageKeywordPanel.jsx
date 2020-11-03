import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput, Row, Col, Collection, CollectionItem, Icon } from 'react-materialize';
import { PATH_STOCKLIST } from "../../Constants";
import { useHistory } from "react-router-dom";
import { fetchAllKeywords, addKeyword, deleteKeyword } from "../util/RestClient";
import ErrorDisplay from "../parts/ErrorDisplay";
import PendingDisplay from "../parts/PendingDisplay";
import ConfirmDialog from "../parts/ConfirmDialog";

const ManageKeywordPanel = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const allKeywords = useSelector((state) => state.keyword.keywords);
    const keywordText = useSelector((state) => state.keyword.keywordText);
    const keywordError = useSelector(state => state.keyword.error);
    const keywordConfirm = useSelector(state => state.keyword.confirm);
    const toDeleteId = useSelector(state => state.toDeleteId);

    // Fetch all stocks before page load
    useEffect(() => {
        fetchAllKeywords(dispatch);
        //dispatch({ type: "FETCH_ALL_STOCKS_SUCCESS", payload: { stocks: ["aaa", "bbb"] } });
    }, []);

    const handleKeywordChange = (e) => {
        dispatch({
            type: "SET_KEYWORD_VALUE",
            payload: { value: e.target.value }
        });
    }



    const handleStockListByKeyword = (keywordId) => {
        dispatch({ type: "SWITCH_TO_STOCKLIST_BY_KEYWORD", payload: { keywordId: keywordId } })
        history.push(PATH_STOCKLIST);
    }

    const handleConfirmDelete = () => {
        if (toDeleteId >= 0) {
            deleteKeyword(dispatch, toDeleteId);
        }
    }
    const handleConfirmCancel = () => {
        dispatch({ type: "CANCEL_DELETE" });
    }
    const getKeywordConfirmHtml = () => {
        if (keywordConfirm) {
            return (
                <ConfirmDialog prompt="Keyword has associated ticker symbols. Confirm delete?" onOkHandler={handleConfirmDelete}
                    onCancelHandler={handleConfirmCancel}>
                </ConfirmDialog>
            );
        }
        else {
            return (<div></div>);
        }
    }
    const handleDeleteKeywordConfirm = (keywordId, associatedTickerCount) => {
        if (associatedTickerCount === 0) {
            deleteKeyword(dispatch, keywordId)
        }
        else {
            dispatch({ type: "REQUEST_CONFIRM_DELETE", payload: { keywordId: keywordId } });
        }
    }

    return (
        <div>
            {getKeywordConfirmHtml()}
            <PendingDisplay></PendingDisplay>
            <ErrorDisplay handleCloseDialog={() => { dispatch({ type: "CLEAR_ERROR" }) }} error={keywordError}></ErrorDisplay>
            <div>
                <div className="sector-create-input inline">
                    <TextInput id="TextInput-4" onChange={handleKeywordChange} value={keywordText} />
                </div>
                <Button
                    node="button"
                    style={{
                        marginRight: '5px'
                    }}
                    className="inline"
                    onClick={() => addKeyword(dispatch, keywordText)}
                >Add Keyword</Button>
            </div>
            <Row>
                <Col
                    m={12}
                    s={12}
                    l={6}
                    xl={6}
                >
                    <Collection>
                        {allKeywords.map((keyword, index) => {
                            let color = "#ffffff";
                            if (index % 2 == 0) {
                                color = "#eeeeee";
                            }
                            return (
                                <div key={index}>
                                    <CollectionItem key={index} style={{ backgroundColor: color, padding: "0px", width: "100%" }}>
                                        <div className="hoverchange row-item">
                                            <div className="keyword-fixed inline nogrow">
                                                {keyword.keyword}
                                            </div>
                                            <div className="inline grow">
                                                {keyword.stocks.length} tickers
                                            </div>
                                            <div className="inline" onClick={() => handleDeleteKeywordConfirm(keyword.id, keyword.stocks.length)}>
                                                <Icon tiny className="buttonhover">
                                                    delete
                                                </Icon>
                                            </div>
                                            <div className="inline" onClick={() => handleStockListByKeyword(keyword.id)}>
                                                <Icon tiny className="buttonhover">
                                                    forward
                                                    </Icon>
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
        </div>
    );
}

export default ManageKeywordPanel;
