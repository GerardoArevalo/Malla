import React, { useState, useEffect } from "react";
import { Grid, Button, TextField, Select, MenuItem, InputLabel, FormControl, Chip, Paper } from '@material-ui/core';
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


function EditItemModal({ courseId, itemCategory, handleClose, item = null }) {
    const { control, handleSubmit } = useForm();

    async function updateItem(inputData) {
        console.log(itemCategory)
        var data = {
            name: inputData.name,
            id: itemCategory.item.id,
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

    async function deleteActivity(id) {
        await fetch(`${process.env.REACT_APP_API_URL}/activity/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const classes = useStyles();
    const [selectedActivities, setselectedActivities] = useState(itemCategory.item.activities);
    const [activities, setActivities] = useState([]);

    useEffect(() => getCourseActivities(courseId).then(res => setActivities(res)), []);

    const handleChange = (event) => {

        setselectedActivities(event.target.value);
    };
    const handleUpdate = async data => {
        updateItem(data).then(async () => {
            //selectedActivities.filter((el) => el !== value);
            let deleted = itemCategory.item.activities.filter((activity) => !selectedActivities.includes(activity));
            let added = selectedActivities.filter((activity) => !itemCategory.item.activities.includes(activity));
            let addedActivities = added.map(async activity => await addActivity(itemCategory.item.id, activity))
            await Promise.all(addedActivities)
            let deletedActivities = deleted.map(async activity => await deleteActivity(activity.id))
            await Promise.all(deletedActivities)
            handleClose(true)
        });
    }
    const handleDelete = (value) => {
        setselectedActivities((current) => current.filter((el) => el !== value));
    };

    return (
        <form onSubmit={handleSubmit(handleUpdate)}>
            <Grid container alignItems="flex-start" spacing={2}>
                <h2 id="simple-modal-title">Modificar {itemCategory.item.name} </h2>
                <Grid item xs={10}>
                    <Controller
                        name="name"
                        defaultValue={itemCategory.item.name}
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
                    <Button type="submit" variant="contained" color="primary" >Guardar</Button>
                </Grid>
            </Grid>
        </form>
    );

}

export default EditItemModal;