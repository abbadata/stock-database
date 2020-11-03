import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Select } from 'react-materialize';
import { fetchAllKeywords } from "../util/RestClient";
import { PATH_STOCKLIST } from "../../Constants";
import { useHistory } from "react-router-dom";

const KeywordFilter = ({ keywordId, handleKeywordChange }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const allKeywords = useSelector((state) => state.keyword.keywords);
    //const filterKeywordId = useSelector(state => state.stockList.filter.keywordId)

    // Fetch all stocks before page load
    useEffect(() => {
        fetchAllKeywords(dispatch);
        //dispatch({ type: "FETCH_ALL_STOCKS_SUCCESS", payload: { stocks: ["aaa", "bbb"] } });
    }, []);

    useEffect(() => {
        // This hack was necessary since update to bug with updating value of select.
        // https://github.com/react-materialize/react-materialize/issues/1147
        if (keywordId == -1) {
            let elem = document.querySelector(".keyword-filter-input input");
            if (elem) {
                elem.value = "";
            }
        }
    }, [keywordId])

    return (
        <div className="inline">
            <div className="keyword-filter-input inline">
                <Select
                    id="keyword-filter-select"
                    onChange={handleKeywordChange}
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
                    value={keywordId}
                >
                    <option
                        value="-1"
                    >
                        Choose keywords
                    </option>
                    {allKeywords.map((e) => {
                        return (<option value={e.id} key={e.id}>
                            {e.keyword}
                        </option>)
                    })}

                </Select>
            </div>
        </div>);
}

export default KeywordFilter;
