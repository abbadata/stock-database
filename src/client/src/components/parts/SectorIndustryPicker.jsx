import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import 'materialize-css';
import { Select } from 'react-materialize';
import { fetchAllSectors } from "../util/RestClient";
/*global M*/

// Picker for Sector/Industry. Makes sure Industry options are updated as Sector changes.
const SectorIndustryPicker = ({ inputSectorId, inputIndustryId, changeSectorHandler, changeIndustryHandler }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        fetchAllSectors(dispatch);
    }, []);
    useEffect(() => {
        // This hack was necessary since update to bug with updating value of select.
        // https://github.com/react-materialize/react-materialize/issues/1147
        if (inputSectorId == -1) {
            let elem = document.querySelector(".sector-filter-input input");
            if (elem) {
                elem.value = "";
            }
        }
    }, [inputSectorId])
    const allSectors = useSelector(state => state.sector.list);

    let industryListInCurrentSector = [];
    allSectors.forEach((sector, index) => {
        if (sector.id == inputSectorId) {
            sector.industries.forEach((industry, index2) => {
                industryListInCurrentSector.push(<option key={index} value={industry.id.toString()}>{industry.name}</option>);
            });
        }
    });

    return (
        <div className="inline">
            <div className="sector-filter-input inline">
                <Select
                    label="Sector"
                    multiple={false}
                    value={inputSectorId}
                    onChange={changeSectorHandler}
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
                    <option value="-1"></option>
                    {allSectors.map((sector, index) => {
                        return (<option key={index} value={sector.id.toString()}>{sector.name}</option>);
                    })}
                </Select>
            </div>
            <div className="industry-input inline">
                <Select
                    label="Industry"
                    multiple={false}
                    value={inputIndustryId}
                    onChange={changeIndustryHandler}
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
                    <option value="-1"></option>
                    {industryListInCurrentSector}
                </Select>
            </div>
        </div>
    );
}

export default SectorIndustryPicker;
