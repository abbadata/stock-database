import React from "react";
import { Modal, Button } from 'react-materialize';

const ErrorDisplay = (({ error, handleCloseDialog }) => {
    if (error != "") {
        return (
            <Modal
                actions={[
                    <Button flat modal="close" node="button">Close</Button>
                ]}
                bottomSheet={false}
                fixedFooter={false}
                id="error-modal"
                open={true}
                options={{
                    dismissible: false,
                    endingTop: '10%',
                    inDuration: 250,
                    onCloseEnd: handleCloseDialog,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    opacity: 0.5,
                    outDuration: 250,
                    preventScrolling: true,
                    startingTop: '4%'
                }}
            >
                {error}
            </Modal>
        );
    }
    else {
        return (<div></div>);
    }
});

export default ErrorDisplay;
