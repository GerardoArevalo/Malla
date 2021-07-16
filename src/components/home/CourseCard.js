import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, Avatar, IconButton } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CourseCardContent from './CourseCardContent.js'
import ModalBase from "../ModalBase.js";
import CreateModal from "./CreateModal.js";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 350,
        width: 350,
        height: "auto",
        maxHeight: 350,
        minHeight: 200,
        display: 'inline-block',
        margin: '0 10px'
    },
    avatar: {
        backgroundColor: red[500],
    },

}));

export default function CourseCard({ course }) {
    const classes = useStyles();

    const [moodle, setMoodle] = useState(null);
    const [structures, setStructures] = useState(null);
    const [open, setOpen] = useState(false);

    async function getMoodleDetails(id) {
        return await fetch(`${process.env.REACT_APP_API_URL}/moodle/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    async function getStructures(id) {
        return fetch(`${process.env.REACT_APP_API_URL}/course/${id}/structures`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    useEffect(() => getMoodleDetails(course.moodleid).then(res => setMoodle(res)), []);

    useEffect(() => getStructures(course.id).then(res => setStructures(res)), []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddClick = () => {
        setOpen(true)
    };
    const modal = () => {
        return <CreateModal courseId={course.id} handleClose={handleClose} />
    }

    return (
        <Card className={classes.root}>
            {<ModalBase open={open} handleClose={handleClose} modalBody={modal()} />}
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        R
          </Avatar>
                }
                action={
                    <IconButton aria-label="settings"
                        onClick={handleAddClick} >
                        <AddCircleIcon />
                    </IconButton>
                }
                title={course.shortname}
                subheader={moodle !== null ? moodle.name : ""}
            />
            <CourseCardContent structures={structures}></CourseCardContent>

        </Card >
    );
}
