import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, TextInput } from 'react-materialize';

const ContainsNotContainsFilter = ({ textValue, handleOnChange, handleOnChangeOperation }) => {
    return (
        <div className="inline">
            <div className="contains-select inline">
                <Select
                    multiple={false}
                    onChange={handleOnChangeOperation}
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
                    value="contains"
                >
                    <option value="contains">
                        Contains
            </option>
                    <option value="not_contains">
                        Does Not Contain
            </option>
                </Select>
            </div>
            <div className="filter-textinput inline">
                <TextInput value={textValue} onChange={handleOnChange}></TextInput>
            </div>
        </div>
    );
}

export default ContainsNotContainsFilter;
