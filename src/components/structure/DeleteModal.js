import React from "react";
import { useHistory } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import '../../styles/modal.css';
function DeleteModal({ structureId, handleClose }) {
    let history = useHistory();

    async function deleteStructure() {
        await fetch(`${process.env.REACT_APP_API_URL}/structure/${structureId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        history.push(`/`)
    }

    return (
        <div className="modal">
            <Grid container alignItems="flex-start" spacing={2}>
                <h2 id="simple-modal-title">Eliminar estructura </h2>
                <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        ¿De verdad desea eliminar la estructura?
                    </Typography>
                </Grid>

                <Grid item xs={5}>
                    <Button variant="contained" onClick={() => { handleClose() }}>Cancelar</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" color="primary" onClick={deleteStructure}>Eliminar</Button>
                </Grid>
            </Grid>

        </div >
    );

}

export default DeleteModal;