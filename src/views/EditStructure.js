import React from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar.js';
import EditForm from '../components/structure/EditForm.js';

function EditStructure() {
    let { id } = useParams();

    return (
        <>
            <Navbar user={"Username"} />

            <EditForm id={id} type={"edit"} />
        </>
    );

}

export default EditStructure;