import React, { useState, useEffect } from "react";
import CourseCard from './CourseCard.js';
import '../../styles/home.css';
function HomeMain() {

    const [courses, setCourses] = useState(null);

    function getCourses(userid) {
        return fetch(`${process.env.REACT_APP_API_URL}/moodle/1/user/${userid}/courses`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(res => res);
    }

    useEffect(() => getCourses(1003).then(res => setCourses(res)), []);

    let cards = courses == null ? <div className="loader"></div> : courses.map((el, index) => (
        <CourseCard key={index} course={el}></CourseCard>
    ));
    return (
        <>
            <div className="main">
                <div className="container">
                    {cards}
                </div>
            </div>
        </>
    );

}

export default HomeMain;