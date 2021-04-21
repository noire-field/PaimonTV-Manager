import React from 'react';
import Navbar from './../components/Navbar';
import Library from './../pages/Library';

function MainScreen(props) {
    return (
        <div className="main-screen">
            <Navbar/>
            <Library/>
        </div>
    )
}

export default MainScreen;