import React from "react";
import { Modal, Backdrop, Fade } from '@material-ui/core';
import './../styles/modal.css';
function ModalBase({ open, handleClose, modalBody }) {

    const handleOpen = () => {

        return open;
    };
    return (
        <Modal
            open={handleOpen()}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 1000,
            }}
        ><Fade in={open} >
                {modalBody}
            </Fade>
        </Modal>
    );

}

export default ModalBase;