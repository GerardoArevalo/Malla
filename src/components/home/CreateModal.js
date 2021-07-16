import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import {
    Grid, Button, TextField,
    Radio, RadioGroup, FormControlLabel,
    Select, MenuItem
} from '@material-ui/core';
import '../../styles/modal.css';
function HomeModal({ courseId, handleClose }) {
    let history = useHistory();
    const { control, handleSubmit } = useForm();

    async function addStructure(inputData) {
        var data = {
            courseid: courseId,
            name: inputData.name,
            moodleid: "1",
            mode: selectType,
            mode_value: selectType === "group" ? inputData.selectGroup : inputData.selectCourse
        };
        console.log(inputData)
        return await fetch(`${process.env.REACT_APP_API_URL}/structure`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            console.log(res)
            return res[0].id
        });

    }

    async function getCourseGroups(moodleid, courseId) {
        return await fetch(`${process.env.REACT_APP_API_URL}/moodle/${moodleid}/course/${courseId}/groups`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }
    const [groups, setGroups] = useState([]);

    useEffect(() => getCourseGroups(1, courseId).then(res => setGroups(res)), []);

    const handleAdd = (data) => {
        addStructure(data).then(res => history.push(`/structure/${res}`))
            .catch(error => {
                console.error(error);
            });
    }

    const [selectType, setselectType] = useState(null);
    const handleRadioChange = (event) => {
        setselectType(event.target.value);
    };

    const selectGrade = () => {
        return (
            <Grid item xs={12}>

                <Controller
                    render={({ field }) => (
                        <Select
                            labelWidth={10}
                            {...field}>
                            <MenuItem value={"Grado A"}>Grado A</MenuItem>
                            <MenuItem value={"Grado B"}>Grado B</MenuItem>
                            <MenuItem value={"Grado C"}>Grado C</MenuItem>
                        </Select>
                    )}
                    name="selectCourse"
                    control={control}
                />
            </Grid>
        )
    }
    const selectGroup = () => {
        return (
            <Grid item xs={12}>
                <Controller
                    render={({ field }) => (
                        <Select inputProps={{
                            style: { width: 10 },
                        }}
                            {...field}>
                            {groups.map(group => <MenuItem key={`group-${group.id}`} value={group.id}>{group.name}</MenuItem>)}
                        </Select>
                    )}
                    name="selectGroup"
                    control={control}
                />
            </Grid>
        )
    }
    return (
        <div className="modal">
            <form onSubmit={handleSubmit(handleAdd)}>
                <Grid container alignItems="flex-start" spacing={2}>
                    <h2 id="simple-modal-title">Crear nueva estructura </h2>
                    <Grid item xs={10}>
                        <Controller
                            name="name"
                            defaultValue="Estructura nueva"
                            control={control}
                            render={({ field }) => <TextField {...field}
                                fullWidth
                                id="name"
                                label="Nombre de la estructura"
                                helperText="Editar nombre de estructura"
                                InputLabelProps={{
                                    style: { color: '#000' },
                                }} />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <label>Seleccionar grado o grupo</label>

                        <Controller
                            name="type"
                            defaultValue="Grado"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    row aria-label="Tipo"

                                    {...field}>
                                    <Grid item xs={5}>
                                        <FormControlLabel
                                            value="course"
                                            control={<Radio onClick={handleRadioChange} />}
                                            label="Grado"
                                        />
                                    </Grid>
                                    <Grid item xs={5}><FormControlLabel value="group" control={<Radio onClick={handleRadioChange} />} label="Grupo" /></Grid>
                                </RadioGroup>

                            )}
                        />

                    </Grid>
                    {selectType === "group" ? selectGroup() : selectGrade()}
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

export default HomeModal;