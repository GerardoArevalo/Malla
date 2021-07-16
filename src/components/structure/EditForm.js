import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Paper,
    TextField,
    Grid,
    Button,
    Link
} from '@material-ui/core';
import ModalBase from "../ModalBase.js";
import ItemModal from "./ItemModal.js";
import '../../styles/structure.css';
function EditForm({ id }) {
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
        }).then(res => res.json()).then(res => res);
    }

    async function getItems(idItemCategory) {
        return await fetch(`${process.env.REACT_APP_API_URL}/itemcategory/${idItemCategory}/items`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    async function getItemActivities(idItem) {
        return await fetch(`${process.env.REACT_APP_API_URL}/item/${idItem}/activities`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }
    async function updateStructure() {
        var data = {
            id: structure.id,
            name: textFieldValue
        };
        await fetch(`${process.env.REACT_APP_API_URL}/structure`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        history.push(`/structure/${structure.id}`);
    }
    const [structure, setStructure] = useState(null);
    const [itemCategories, setItemCategories] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentModal, setcurrentModal] = useState(null);

    useEffect(() => getStructureDetails(id).then(res => {
        setStructure(res);
        setTextFieldValue(res.name)
    }), []);

    useEffect(() => {
        async function fetchData() {
            let categories = await getStructureItemCategories(id);
            let categorieswithItems = categories.map(async category => {
                category.items = await getItems(category.id);
                category.items = category.items.map(async item => {
                    item.activities = await getItemActivities(item.id);
                    return item;
                })

                category.items = await Promise.all(category.items)

                return category
            })
            let result = await Promise.all(categorieswithItems)

            setItemCategories(result)
        }
        fetchData();
    }, []);

    const handleOpen = (itemCategory) => {
        setcurrentModal(itemCategory)
        setOpen(true);

    };
    const reload = () => window.location.reload();
    const handleClose = (item = null) => {
        setcurrentModal(null)
        setOpen(false);
        if (item === true) {
            reload()
        }

    };
    const [textFieldValue, setTextFieldValue] = useState(null);
    const handleTextField = (e) => {
        setTextFieldValue(e.target.value);
    };
    const modal = () => {
        return <ItemModal courseId={structure.courseid} itemCategory={currentModal} handleClose={handleClose} />
    }

    let ItemCategoryElements = itemCategories === null ? <div className="loader"></div> : itemCategories.map(itemCategory => {

        let itemCategoriesList = itemCategory.items ?
            (itemCategory.items.length > 0 ? itemCategory.items.map(item => (
                <div key={`container-${item.id}`}>
                    <Link
                        component="button"
                        variant="body2"
                        key={`update-${item.id}`}
                        onClick={() => { handleOpen({ id: itemCategory.id, name: itemCategory.name, item: item }) }}
                    ><h4 key={`item-${item.id}`}>{item.name}</h4></Link>

                    {item.activities.map(activity => <h5 key={`activity-${activity.id}`}>{activity.name}</h5>)}
                </div>

            )) : <div >No hay items</div>) :
            <div key={`loader-${itemCategory.id}`} className="loader"></div>;

        return (<>
            <h3 key={`category-${itemCategory.id}`}>{itemCategory.name}</h3>
            <div key={`list-${itemCategory.id}`}>{itemCategoriesList}</div>
            <Link
                component="button"
                variant="body2"
                key={`add-${itemCategory.id}`}
                onClick={() => { handleOpen({ id: itemCategory.id, name: itemCategory.name, item: null }) }}
            >Añadir Item</Link>

        </>);
    });

    return (
        <Paper className="form" elevation={3}>
            <Grid container alignItems="flex-start" spacing={3}>
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        id="structure-name"
                        label={textFieldValue}
                        value={textFieldValue}
                        helperText="Editar nombre de estructura"
                        onChange={handleTextField}
                        InputLabelProps={{
                            style: { color: '#000' },
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    {ItemCategoryElements}
                    {currentModal !== null ? <ModalBase open={open} handleClose={handleClose} modalBody={modal()} /> : <></>}
                </Grid>
                <Grid container item xs={12} spacing={2}>

                    <Grid item xs={6}>
                        <Button variant="contained" onClick={() => { history.goBack() }}>Cancelar edición</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color="primary" onClick={updateStructure}>Guardar</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper >
    );

}

export default EditForm;