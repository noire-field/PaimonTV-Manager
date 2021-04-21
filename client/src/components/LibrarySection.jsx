import React from 'react';

import MovieList from './MovieList';

function LibrarySection(props) {
    return (
        <div>
            <div className="d-flex justify-content-start align-items-center">
                <h3 className="text-white ms-2 me-2">{props.title}</h3>
                <button className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i class="fas fa-edit me-1"></i>Edit</button>
            </div>
            <MovieList movies={props.movies}/>
        </div>
    );
}

export default LibrarySection;