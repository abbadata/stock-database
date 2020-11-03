import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chip, Icon, Button } from 'react-materialize';

// Used to print out details of filters used to generate current stock list
const FilterDetails = () => {
    const dispatch = useDispatch();
    const allSectors = useSelector(state => state.sector.list);
    const allKeywords = useSelector((state) => state.keyword.keywords);

    const filterSectorId = useSelector(state => state.stockList.current.sectorId);
    const filterIndustryId = useSelector(state => state.stockList.current.industryId);
    const filterKeywordId = useSelector(state => state.stockList.current.keywordId);

    const filterDescriptionOperation = useSelector(state => state.stockList.current.descriptionOperation);
    const filterDescriptionText = useSelector(state => state.stockList.current.description);
    const filterNotesOperation = useSelector(state => state.stockList.current.notesOperation)
    const filterNotesText = useSelector(state => state.stockList.current.notes)
    const filterCompanyNameOperation = useSelector(state => state.stockList.current.companyNameOperation);
    const filterCompanyNameText = useSelector(state => state.stockList.current.companyName);

    const getSectorFilterText = () => {
        if (filterSectorId >= 0) {
            let sectorName = "";
            allSectors.forEach((sector, index) => {
                if (sector.id == filterSectorId) {
                    sectorName = sector.name;
                }
            });
            return (
                <Chip
                className="inline"
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}>
                    "Sector" = "{sectorName}"
                </Chip> 
            )
        }
        else {
            return (<div className="inline"></div>);
        }
    }

    const getIndustryFilterText = () => {
        if (filterIndustryId >= 0) {
            let industryName = "";
            allSectors.forEach((sector, index) => {
                if (sector.id == filterSectorId) {
                    sector.industries.forEach((industry) => {
                        if (industry.id == filterIndustryId) {
                            industryName = industry.name
                        }
                    });
                }
            });
            return (
                <Chip
                className="inline"
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}>
                    "Industry" = "{industryName}"
                </Chip> 
            )
        }
        else {
            return (<div className="inline"></div>);
        }
    }

    const getKeywordFilterText = () => {
        if (filterKeywordId >= 0) {
            let keyword = "";
            allKeywords.forEach((e) => {
                if (e.id == filterKeywordId) {
                    keyword = e.keyword;
                }
            });
            return (
                <Chip
                className="inline"
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}>
                "Keyword" = "{keyword}"
                </Chip>
            )
        }
        else {
            return (<div className="inline"></div>);
        }
    }

    const getDescriptionFilterText = () => {
        if (filterDescriptionText.trim() !== "") {
            return (
                <Chip
                className="inline"
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}>
                    "Description" {filterDescriptionOperation} "{filterDescriptionText.trim()}"
                </Chip>
            )
        }
        else {
            return (<div className="inline"></div>);
        }
    }

    const getNotesFilterText = () => {
        if (filterNotesText.trim() !== "") {
            return (
                <Chip
                className="inline"
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}>
                    "Notes" {filterNotesOperation} "{filterNotesText.trim()}"
                </Chip>
            )
        }
        else {
            return (<div className="inline"></div>);
        }
    }

    const getCompanyNameFilterText = () => {
        if (filterCompanyNameText.trim() !== "") {
            return (
                <Chip
                className="inline"
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}>
                    "Company Name" {filterCompanyNameOperation} "{filterCompanyNameText.trim()}"
                </Chip>
            )
        }
        else {
            return (<div className="inline"></div>);
        }
    }

    const getClearFilterHtml = () => {
        if (filterSectorId >= 0 || filterIndustryId >= 0 || filterKeywordId >= 0 ||
            (filterDescriptionText.trim() !== "") || (filterNotesText.trim() !== "") ||
            (filterCompanyNameText.trim() !== "") ) {
            return (
                <div className="button-indent">
                    <Button
                        node="button"
                        onClick={handleClearFilter}
                    >
                        Clear Filters
                    </Button>
                </div>
            )
        }
        else {
            return (<div></div>);
        }
    }
    
    const handleClearFilter = () => {
        dispatch({ type: "CLEAR_STOCKLIST_FILTER" })
    }

    return (
        <div>
            {getCompanyNameFilterText()}
            {getDescriptionFilterText()}
            {getNotesFilterText()}
            {getSectorFilterText()}
            {getIndustryFilterText()}
            {getKeywordFilterText()}
            {getClearFilterHtml()}
        </div>
    );
}

export default FilterDetails;
