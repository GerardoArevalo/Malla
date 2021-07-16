import React from 'react';
import { Link } from 'react-router-dom';
import { CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "../../styles/spinner.css";

export default function CourseCardContent({ structures }) {

    function showAccordion() {
        return <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography >Ver más</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ maxHeight: 100, overflow: "auto" }}>
                <List style={{ maxHeight: "100%", overflow: "auto" }}>
                    {structures.slice(5, structures.length).map((structure, index) =>
                        <ListItem style={{ width: "500px" }} key={index} ><Link to={`/structure/${structure.id}`}>{structure.name}</Link></ListItem>
                    )}
                </List>



            </AccordionDetails>
        </Accordion>
    }

    let structuresList = structures == null ? <div className="loader"></div> : structures.length > 0 ?
        structures.slice(0, 5).map((structure, index) =>
            <div key={index} ><Link to={`/structure/${structure.id}`}>{structure.name}</Link></div>)
        : <div>No hay estructuras</div>

    return (
        <CardContent>
            <Typography variant="body2" color="textSecondary" component="div">
                {structuresList}
            </Typography>
            {structures != null ? (structures.length > 5 ? showAccordion() : <></>) : <></>}
        </CardContent >
    );
}
