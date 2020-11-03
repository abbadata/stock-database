import React from "react";
import { Modal, Button } from 'react-materialize';


const ConfirmDialog = ({ prompt, onOkHandler, onCancelHandler }) => {
    return (
        <Modal
            actions={[
                <Button flat modal="close" node="button" waves="green" onClick={onOkHandler}>OK</Button>,
                <Button flat modal="close" node="button" waves="red" onClick={onCancelHandler}>Cancel</Button>
            ]}
            bottomSheet={false}
            fixedFooter={false}
            id="modal1"
            open={true}
            options={{
                dismissible: true,
                endingTop: '10%',
                inDuration: 250,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                opacity: 0.5,
                outDuration: 250,
                preventScrolling: true,
                startingTop: '4%'
            }}
        >
            {prompt}
        </Modal>
    )
}

export default ConfirmDialog;
