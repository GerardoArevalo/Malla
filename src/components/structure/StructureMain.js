import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Paper,
    Grid,
    Button,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import ModalBase from "../ModalBase.js";
import DeleteModal from "./DeleteModal.js";
import '../../styles/structure.css';

function StructureMain({ id }) {
    const history = useHistory();

    async function getStructureDetails(id) {
        return await fetch(`${process.env.REACT_APP_API_URL}/structure/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    async function getStructureItemCategories(id) {
        return await fetch(`${process.env.REACT_APP_API_URL}/structure/${id}/itemcategories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => { console.log(res); return res });
    }

    async function getItems(idItemCategory) {
        return await fetch(`${process.env.REACT_APP_API_URL}/itemcategory/${idItemCategory}/items`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    const [structure, setStructure] = useState(null);
    const [itemCategories, setItemCategories] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = (id) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const modal = () => {
        return <DeleteModal structureId={id} handleClose={handleClose} />
    }
    useEffect(() => getStructureDetails(id).then(res => setStructure(res)), []);

    useEffect(async () => {
        let categories = await getStructureItemCategories(id);

        let categorieswithItems = categories.map(async category => { category.items = await getItems(category.id); return category })
        let result = await Promise.all(categorieswithItems)

        setItemCategories(result)
    }, []);


    let ItemCategoryElements = itemCategories === null ? <div className="loader"></div> : itemCategories.map(itemCategory => {

        let itemCategoriesList = itemCategory.items ?
            (itemCategory.items.length > 0 ? itemCategory.items.map(item => <h4 key={item.id}>{item.name}</h4>) : "No hay items") :
            <div className="loader"></div>;

        return (<>
            <h3 key={itemCategory.id}>{itemCategory.name}</h3>
            <div key={`list-${itemCategory.id}`}>{itemCategoriesList}</div>
        </>);
    });

    return (
        <Paper className="show" elevation={3}>
            {structure ? <ModalBase open={open} handleClose={handleClose} modalBody={modal()} /> : <></>}
            <Grid container alignItems="flex-start" spacing={1}>
                <Grid container item xs={8}>
                    <Grid item xs={10}>
                        <h2>{structure == null ? "" : structure.name}</h2>
                    </Grid>
                    <Grid item xs={12}>
                        {ItemCategoryElements}
                    </Grid>
                </Grid>
                <Grid container direction="column" alignItems="stretch" item xs={4} spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => { handleOpen() }}
                            startIcon={<Delete />}
                        >Eliminar</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            onClick={() => { history.push(`/structure/${id}/edit`) }}
                            startIcon={<Edit />}>Editar</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { history.push(`/structure/${id}/grades`) }}
                        >Notas</Button>
                    </Grid>
                </Grid>
            </Grid>



        </Paper >
    );

}

export default StructureMain;