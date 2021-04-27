import React from 'react';
import { SeriesMoviesToArray } from '../utils/series';

import MovieList from './MovieList';

function LibrarySection(props) {
    const arrayMovies = SeriesMoviesToArray(props.movies);
    return (
        <div>
            <div className="d-flex justify-content-start align-items-center">
                <h3 className="text-white ms-2 me-2">{props.title}</h3>
                <button onClick={(e) => { e.preventDefault(); props.onSectionEdit(props.id) }} className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i className="fas fa-edit me-1"></i>Edit</button>
            </div>
            <MovieList movies={arrayMovies} className="justify-content-lg-start justify-content-center" onMovieClick={props.onMovieClick}/>
        </div>
    );
}

export default React.memo(LibrarySection);