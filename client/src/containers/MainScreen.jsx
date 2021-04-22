import React from 'react';
import Navbar from './../components/Navbar';
import Library from './../pages/Library';
import MyMovies from '../pages/MyMovies';
import Queue from '../pages/Queue';

function MainScreen(props) {
    return (
        <div className="main-screen pbg-primary">
            <Navbar/>
            <Library/>
        </div>
    )
}

export default MainScreen;