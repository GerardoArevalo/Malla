import React from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar.js';
import GradesMain from '../components/grades/GradesMain.js';

function Grades() {
    let { id } = useParams();

    return (
        <>
            <Navbar user={"Username"} />

            <GradesMain id={id} />
        </>
    );

}

export default Grades;