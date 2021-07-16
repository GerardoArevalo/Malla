import React from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar.js';
import StructureMain from "../components/structure/StructureMain.js";

function Structure() {
    let { id } = useParams();

    return (
        <>
            <Navbar user={"Username"} />
            <StructureMain id={id} />
        </>
    );
}

export default Structure;