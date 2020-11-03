import React, { Component, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Autocomplete, Button, TextInput, Row, Textarea, Select, Col, Collection, CollectionItem, Icon, Collapsible, CollapsibleItem } from 'react-materialize';
import axios from 'axios';
import { sendSaveIndustry } from "../util/RestClient";
import ErrorDisplay from "./ErrorDisplay";

const AddIndustryForm = ({ sectorId, addSectorId }) => {
    const dispatch = useDispatch();
    const addIndustryInput = useSelector(state => state.sector.addIndustryInput);
    const addIndustryError = useSelector(state => state.industry.error);

    const turnOffAddIndustry = (sectorId) => {
        dispatch({ type: "TURN_OFF_ADD_INDUSTRY" })
    }
    const handleSetIndustryInput = (e) => {
        dispatch(
            { type: "SET_ADD_INDUSTRY_INPUT", payload: { value: e.target.value } });
    }

    if (sectorId != addSectorId) {
        return <div></div>;
    }
    else {
        return (
            <div className="marginleft30">
                <div className="industry-add row-item inline entry-box">
                    <input type="text" className="entry-box inline" maxLength="100" value={addIndustryInput} onChange={handleSetIndustryInput}></input>
                    <Button
                        node="button"
                        className="tiny-button"
                        onClick={() => sendSaveIndustry(dispatch, sectorId, addIndustryInput)}
                    >
                        Save
                </Button>
                    <Button
                        node="button"
                        className="tiny-button"
                        onClick={turnOffAddIndustry}
                    >
                        Cancel
                </Button>
                </div>
                <ErrorDisplay handleCloseDialog={() => dispatch({ type: "CLEAR_ERROR" })} error={addIndustryError}></ErrorDisplay>
            </div >
        );
    }
}

export default AddIndustryForm;
