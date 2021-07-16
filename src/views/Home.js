import React from "react";
import Navbar from '../components/Navbar.js';
import HomeMain from "../components/home/HomeMain.js";
function Home() {

    return (
        <>
            <Navbar user={"Username"} />
            <HomeMain />
        </>
    );

}

export default Home;