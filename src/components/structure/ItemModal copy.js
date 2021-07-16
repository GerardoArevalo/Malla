import React, { useState, useEffect } from "react";
import { Grid, Button, TextField, Select, MenuItem, InputLabel, FormControl, Chip, Paper } from '@material-ui/core';
import CancelIcon from "@material-ui/icons/Cancel";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
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


function ItemModal({ courseId, itemCategory, handleClose }) {
    const { control, handleSubmit } = useForm();

    async function addItem(inputData) {
        var data = {
            name: inputData.name,
            itemcategoryid: itemCategory.id,
        };
        return await fetch(`${process.env.REACT_APP_API_URL}/item`, {
            method: 'PUT',
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
            method: 'PUT',
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

    const classes = useStyles();
    const [selectedActivities, setselectedActivities] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => getCourseActivities(courseId).then(res => setActivities(res)), []);

    const handleChange = (event) => {
        console.log(itemCategory)
        setselectedActivities(event.target.value);
    };
    const handleAdd = async data => {
        addItem(data).then(async res => {
            let addedActivities = selectedActivities.map(async activity => await addActivity(res[0].id, activity))
            await Promise.all(addedActivities)
            handleClose(true)
        });
    }
    const handleDelete = (value) => {
        setselectedActivities((current) => current.filter((el) => el !== value)
        );

    };

    const handleEdit = (event) => {
        console.log(this.state.value);

    }

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

export default ItemModal;