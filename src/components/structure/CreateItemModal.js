import React, { useState, useEffect } from "react";
import { Grid, Button, TextField, Input, Select, MenuItem, InputLabel, FormControl, Chip, Paper } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import '../../styles/modal.css';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));


function CreateItemModal({ courseId, itemCategory, handleClose }) {
    const { control, handleSubmit } = useForm();

    async function addItem(inputData, edit) {
        var data = {
            name: inputData.name,
            itemcategoryid: itemCategory.id,
            weight: inputData.weight,
            editable: edit
        };
        return await fetch(`${process.env.REACT_APP_API_URL}/item`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => res);

    }
    async function addActivity(itemId, inputData) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("itemid", itemId);
        urlencoded.append("name", inputData.name);
        urlencoded.append("modname", inputData.modname);
        urlencoded.append("instance", inputData.instance);
        urlencoded.append("cmid", inputData.id);
        urlencoded.append("url", inputData.url);
        return await fetch(`${process.env.REACT_APP_API_URL}/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlencoded
        }).then(res => res.json()).then(res => res);

    }
    async function getCourseActivities(id) {
        return await fetch(`${process.env.REACT_APP_API_URL}/moodle/1/course/${id}/activities`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    async function getItems(id) {
        return await fetch(`${process.env.REACT_APP_API_URL}/itemcategory/${id}/items`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    const classes = useStyles();
    const [selectedActivities, setselectedActivities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [totalWeight, setTotalWeight] = useState(null);

    useEffect(() => getCourseActivities(courseId).then(res => setActivities(res)), []);

    useEffect(() => getItems(itemCategory.id).then(res => setTotalWeight(res.reduce((total, item) => total + parseInt(item.weight), 0))), []);

    const handleChange = (event) => {

        setselectedActivities(event.target.value);
    };
    const handleAdd = async (data) => {
        let editable = selectedActivities.length > 0 ? 0 : 1;
        if (data.weight == "") {
            data.weight = 0;
        }
        if (data.weight > 100 || data.weight < 0) {
            alert("El valor debe estar entre 0 y 100")
        } else if (totalWeight + parseInt(data.weight) > 100) {

            alert("El valor excede al 100% en la estructura.")
        }
        else {
            addItem(data, editable).then(async res => {

                let addedActivities = selectedActivities.map(async activity => await addActivity(res.id, activity))

                await Promise.all(addedActivities)
                handleClose(true)
            });
        }
    }
    const handleDelete = (value) => {
        setselectedActivities((current) => current.filter((el) => el !== value)
        );

    };

    return (

        <div className="modal">
            <form onSubmit={handleSubmit(handleAdd)}>
                <Grid container alignItems="flex-start" spacing={2}>
                    <h2 id="simple-modal-title">Crear nuevo Item para {itemCategory.name} </h2>
                    <Grid item xs={10}>
                        <Controller
                            name="name"
                            defaultValue="Item Nuevo"
                            control={control}
                            render={({ field }) => <TextField {...field}
                                fullWidth
                                id="name"
                                label="Nombre de item"
                                helperText="Editar nombre de item"
                                InputLabelProps={{
                                    style: { color: '#000' },
                                }} />}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Controller
                            name="weight"
                            defaultValue="0"

                            control={control}
                            render={({ field }) => <Input {...field}
                                fullWidth
                                id="weight"
                                type="number"
                                placeholder="Peso"
                                InputLabelProps={{
                                    style: { color: '#000' },
                                }}


                            />}
                        />
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item xs={12}><label>Seleccionar actividades</label></Grid>
                        <Controller

                            name="SelectActivity"
                            control={control}
                            render={() => (
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-mutiple-chip-label">Actividades</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-chip-label"
                                        id="demo-mutiple-chip-checkbox"
                                        name="SelectActivity"
                                        multiple
                                        value={selectedActivities}
                                        onChange={handleChange}
                                        renderValue={() => <></>}
                                    >
                                        {activities.map((activity) => (
                                            <MenuItem key={activity.id} value={activity}>
                                                {activity.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                        />

                        <Grid item xs={12}>
                            <Paper component="ul" className={classes.root}>
                                {selectedActivities.map((value) => (
                                    <Chip
                                        key={value.id}
                                        label={value.name}
                                        clickable
                                        className={classes.chip}
                                        onDelete={() => handleDelete(value)}
                                        onClick={() => console.log("clicked chip")}
                                    />
                                ))}
                            </Paper>
                        </Grid>

                    </Grid>
                    <Grid item xs={5}>
                        <Button variant="contained" onClick={() => { handleClose() }}>Cancelar</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button type="submit" variant="contained" color="primary" >Añadir</Button>
                    </Grid>
                </Grid>
            </form>
        </div >

    );

}

export default CreateItemModal;