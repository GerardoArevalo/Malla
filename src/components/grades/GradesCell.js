import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import '../../styles/grades.css';

function GradesCell({ gradeValue, editable }) {

    const [grade, setGrade] = useState(gradeValue);

    const [textFieldValue, setTextFieldValue] = useState(gradeValue.value);
    const handleTextField = (e) => {
        setTextFieldValue(e.target.value);
    };


    async function updateGrade() {
        var data = {
            id: grade.id,
            value: textFieldValue
        };
        fetch(`${process.env.REACT_APP_API_URL}/grade`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            setGrade(res)

        });

    }


    return (

        editable == 1 ? <TextField
            size="small"
            className="text"
            id={`grade-${grade.id}`}
            value={textFieldValue}
            onBlur={updateGrade}
            onChange={handleTextField}
            InputLabelProps={{
                style: { color: '#000' },
            }}
        /> : grade.value

    );

}

export default GradesCell;