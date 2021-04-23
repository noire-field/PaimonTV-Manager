import React from 'react';
import Main from './MyMovies/Main';
import AddMovie from './MyMovies/AddMovie';
import EditMovie from './MyMovies/EditMovie';
import AddEpisode from './MyMovies/AddEpisode';
import EditEpisode from './MyMovies/EditEpisode';

function MyMovies(props) {

    return (
        <div className="my-movies pt-5">
            <Main/>
        </div>
    );
}

export default MyMovies;