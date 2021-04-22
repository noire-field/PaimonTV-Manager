import React from 'react';
import Navbar from './../components/Navbar';
import Library from './../pages/Library';
import MyMovies from '../pages/MyMovies';
import Queue from '../pages/Queue';

function MainScreen(props) {
    console.log(`[App] > [MainScreen] Render`);
    return (
        <div className="main-screen pbg-primary">
            <Navbar/>
            <Library/>
        </div>
    )
}

export default React.memo(MainScreen);