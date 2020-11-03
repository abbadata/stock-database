import React from "react";
import { useSelector } from "react-redux";

const PendingDisplay = () => {
    const stockPending = useSelector(state => state.stock.pending);
    const stockListPending = useSelector(state => state.stockList.pending);
    const keywordPending = useSelector(state => state.keyword.pending);
    const sectorPending = useSelector(state => state.sector.pending);
    const industryPending = useSelector(state => state.industry.pending);

    if (stockPending == 1 || stockListPending == 1 || keywordPending == 1 || sectorPending == 1 || industryPending == 1) {
        return (<div id="pending"></div>);
    }
    else {
        return (<div></div>);
    }
}

export default PendingDisplay;
