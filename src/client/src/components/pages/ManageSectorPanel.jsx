import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput, Row, Col, Collection, CollectionItem, Icon } from 'react-materialize';
import AddIndustryForm from "../parts/AddIndustryForm";
import { fetchAllSectors, deleteIndustry, deleteSector, addSector } from "../util/RestClient";
import { useHistory } from "react-router-dom";
import { PATH_STOCKLIST } from "../../Constants";
import ErrorDisplay from "../parts/ErrorDisplay";
import PendingDisplay from "../parts/PendingDisplay";

const ManageSectorPanel = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const allSectors = useSelector(state => state.sector.list);
    const sectorText = useSelector((state) => state.sector.input);
    const addSectorId = useSelector(state => state.sector.addSectorId);
    const numChanges = useSelector(state => state.sector.numChanges);
    const sectorError = useSelector(state => state.sector.error);

    useEffect(() => {
        fetchAllSectors(dispatch);
    }, [numChanges]);

    const handleSectorChange = (e) => {
        dispatch({
            type: "SET_SECTOR_VALUE",
            payload: { value: e.target.value }
        });
    }


    const handleStockListByIndustry = (sectorId, industryId) => {
        dispatch({ type: "SWITCH_TO_STOCKLIST_BY_INDUSTRY", payload: { sectorId: sectorId, industryId: industryId } })
        history.push(PATH_STOCKLIST);
    }
    const handleStockListBySector = (sectorId) => {
        dispatch({ type: "SWITCH_TO_STOCKLIST_BY_SECTOR", payload: { sectorId: sectorId } })
        history.push(PATH_STOCKLIST);
    }
    const turnOnAddIndustry = (sectorId) => {
        dispatch({ type: "TURN_ON_ADD_INDUSTRY", payload: { id: sectorId } })
    }

    return (
        <div>
            <PendingDisplay></PendingDisplay>
            <ErrorDisplay handleCloseDialog={() => { dispatch({ type: "CLEAR_ERROR" }) }} error={sectorError}></ErrorDisplay>
            <div>
                <div className="sector-create-input inline">
                    <TextInput id="TextInput-4" onChange={handleSectorChange} value={sectorText} placeholder="Enter New Sector" />
                </div>
                <Button
                    node="button"
                    style={{
                        marginRight: '5px'
                    }}
                    className="inline"
                    onClick={() => addSector(dispatch, sectorText)}
                >Add Sector</Button>
            </div>
            <Row>
                <Col
                    m={12}
                    s={12}
                    l={6}
                    xl={6}
                >
                    <Collection>
                        {allSectors.map((sector, index) => {
                            let industries = sector.industries;
                            return (
                                <div key={sector.id}>
                                    <CollectionItem key={index} style={{ backgroundColor: "#eeeeee", padding: "0px" }}>
                                        <div className="sector-row row-item">
                                            <div className="grow">{sector.name}</div>
                                            <div className="addindustry-button" onClick={() => turnOnAddIndustry(sector.id)}>+Industry </div>
                                            <div className="inline" onClick={() => deleteSector(dispatch, sector.id)}>
                                                <Icon small className="buttonhover">
                                                    delete
                                                </Icon>
                                            </div>
                                            <div className="inline" onClick={() => handleStockListBySector(sector.id)}>
                                                <Icon small className="buttonhover">
                                                    forward
                                                </Icon>
                                            </div>
                                        </div>
                                        <Collection>
                                            <AddIndustryForm sectorId={sector.id} addSectorId={addSectorId}></AddIndustryForm>
                                            {industries.map((industry, index2) => {
                                                let color = "#ffffff";
                                                if (index2 % 2 == 0) {
                                                    color = "#eeeeee";
                                                }
                                                return (
                                                    <div className="industry-row" key={industry.id}>
                                                        <CollectionItem style={{ backgroundColor: color, padding: "0px", width: "100%" }}>
                                                            <div className="hoverchange row-item">
                                                                <div className="inline grow">
                                                                    {industry.name}
                                                                </div>
                                                                <div className="inline" onClick={() => deleteIndustry(dispatch, industry.id)}>
                                                                    <Icon tiny className="buttonhover">
                                                                        delete
                                                                    </Icon>
                                                                </div>
                                                                <div className="inline" onClick={() => handleStockListByIndustry(sector.id, industry.id)}>
                                                                    <Icon tiny className="buttonhover">
                                                                        forward
                                                                    </Icon>
                                                                </div>
                                                            </div>
                                                        </CollectionItem>
                                                    </div>
                                                )
                                            })}
                                        </Collection>
                                    </CollectionItem>
                                </div>
                            )
                        }
                        )}
                    </Collection>
                </Col>
            </Row>
        </div >
    );
}

export default ManageSectorPanel;