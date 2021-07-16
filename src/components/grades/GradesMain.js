import React, { useState, useEffect } from "react";
import '../../styles/home.css';
import '../../styles/grades.css';
import GradesCell from './GradesCell';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function GradesMain({ id }) {

    const [grades, setGrades] = useState(null);
    const [finalGrades, setFinalGrades] = useState(null);
    const [students] = useState([]);

    async function getStructure(id) {
        return await fetch(`${process.env.REACT_APP_API_URL}/structure/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    function getGrades(id) {
        return fetch(`${process.env.REACT_APP_API_URL}/structure/${id}/grades`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    function getFinalGrades(id) {
        return fetch(`${process.env.REACT_APP_API_URL}/structure/${id}/grades/final`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    function retrieveGrades(id) {

        return fetch(`${process.env.REACT_APP_API_URL}/structure/${id}/grades/retrieve`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    function updateGrades(id) {
        setGrades(null);
        retrieveGrades(id).then(res => {
            res.map((category) => {
                category.items.map(item => {
                    item.grades.map(grade => {
                        if (!students.includes(grade.username)) {
                            students.push(grade.username)
                        }
                    })
                })
            })
            setGrades(res);
        })
    }

    useEffect(() => getStructure(id).then(structure => {
        structure.graded == 1 ?
            getGrades(id).then(res => {
                res.map((category) => {
                    category.items.map(item => {
                        item.grades.map(grade => {
                            if (!students.includes(grade.username)) {
                                students.push(grade.username)
                            }
                        })
                    })
                })
                setGrades(res);
            })
            :
            retrieveGrades(id).then(res => {
                res.map((category) => {
                    category.items.map(item => {
                        item.grades.map(grade => {
                            if (!students.includes(grade.username)) {
                                students.push(grade.username)
                            }
                        })
                    })
                })
                setGrades(res);
            })

    }), []);

    useEffect(() => getFinalGrades(id).then(grades => {
        setFinalGrades(grades);
    }), []);

    let headers = [];
    let itemsName = [];
    let rows = [];
    let finalRows = [];
    let finalHeaders = [];
    if (grades !== null && finalGrades !== null) {
        headers.push({ name: "student-header", tag: <TableCell key="students" >Estudiantes</TableCell> })
        finalHeaders.push({ name: "student-header", tag: <TableCell key="final-students" >Estudiantes</TableCell> })
        itemsName.push({ name: "blank", tag: <TableCell key="blank" >  </TableCell> })
        students.map(student => {
            let row = [];

            grades.map((category) => {
                if (!headers.some(e => e.name === category.name)) {
                    headers.push({
                        name: category.name,
                        tag: <TableCell key={`category-${category.id}`}
                            colSpan={category.items.length < 1 ? 1 : category.items.length}>{category.name}</TableCell>
                    })
                }
                category.items.map(item => {

                    if (!itemsName.some(e => e.name === item.name)) {
                        itemsName.push({ name: item.name, tag: < TableCell key={`item-${item.id}`}>{`${item.name} (${item.weight}%)`} </TableCell > })
                    }
                    if (!row.some(e => e.name === student)) {
                        row.push({ name: student, tag: <TableCell key={student}>{student}</TableCell> })
                    }

                    let search = item.grades.find(obj => {
                        return obj.username === student;
                    })
                    let result = search !== undefined ? <TableCell key={`grade-${search.id}`}><GradesCell gradeValue={search} editable={item.editable} /></TableCell> :
                        <TableCell key={`grade-empty${item.id}`}>-</TableCell>;
                    row.push({ name: "grade", tag: result });
                })

            })
            rows.push(row);

            let finalRow = [];


            finalGrades.map(category => {

                if (!finalHeaders.some(e => e.name === category.name)) {
                    finalHeaders.push({
                        name: category.name,
                        tag: <TableCell key={`final-category-${category.id}`}>{category.name}</TableCell>
                    })
                }
                if (!finalRow.some(e => e.name === student)) {
                    finalRow.push({ name: student, tag: <TableCell key={`final-${student}`}>{student}</TableCell> })
                }
                let search = category.final[student];
                let result = search !== undefined ?
                    <TableCell key={`final-grade-${student}-${category.id}`}>{search}</TableCell> :
                    <TableCell key={`final-grade-empty${student}-${category.id}`}>-</TableCell>;
                finalRow.push({ name: "grade", tag: result });
            })
            finalRows.push(finalRow);
        })
    }

    let gradesTable = <Paper>
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow> {headers.map(x => x.tag)}</TableRow>
                    <TableRow>{itemsName.map(x => x.tag)}</TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        return <TableRow>
                            {row.map(x => x.tag)}
                        </TableRow>
                    })}
                </TableBody>

            </Table>
        </TableContainer>
    </Paper>;


    let finalGradesTable = <Paper>
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow> {finalHeaders.map(x => x.tag)}</TableRow>

                </TableHead>
                <TableBody>
                    {finalRows.map(row => {
                        return <TableRow>
                            {row.map(x => x.tag)}
                        </TableRow>
                    })}
                </TableBody>

            </Table>
        </TableContainer>
    </Paper>;

    let body = <>
        <h1>Notas Estructura</h1>
        <div className="container">
            {gradesTable}
            <Button
                variant="contained"
                color="secondary"
                className="update"
                onClick={() => { updateGrades(id) }}
            >Actualizar Notas</Button></div>
        <h1>Notas Finales</h1>
        <div className="container">
            {finalGradesTable}
            <Button
                variant="contained"
                color="secondary"
                className="update"
                onClick={() => { alert("Se enviarán las notas") }}
            >Enviar Notas</Button></div>

    </>;

    return (
        <>
            <div className="main">
                {grades == null ? <div className="loader"></div> : body}
            </div>
        </>
    );

}

export default GradesMain;