import React from 'react';
import Main from './MyMovies/Main';
import AddMovie from './MyMovies/AddMovie';
import EditMovie from './MyMovies/EditMovie';

function MyMovies(props) {

    return (
        <div className="my-movies pt-5">
            <EditMovie/>
        </div>
    );
}

export default MyMovies;