import React from 'react';
import Navbar from './../components/Navbar';
import Library from './../pages/Library';
import MyMovies from '../pages/MyMovies';

function MainScreen(props) {
    return (
        <div className="main-screen">
            <Navbar/>
            <MyMovies/>
        </div>
    )
}

export default MainScreen;