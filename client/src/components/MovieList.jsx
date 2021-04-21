import React from 'react';

import MovieItem from './MovieItem';

function MovieList(props) {
    const renderedItems = props.movies.map((m) => {
        return <MovieItem image={m.image}/>
    })
    return (
        <div className="movie-list">
            {renderedItems}
        </div>
    )
}

export default MovieList;