import React from 'react';

import MovieItem from './MovieItem';

function MovieList(props) {
    const renderedItems = props.movies.map((m) => {
        return <MovieItem styles={{...props.styles}} image={m.image}/>
    })
    return (
        <div className={`movie-list ${props.className}`}>
            {props.preList}
            {renderedItems}
        </div>
    )
}

export default MovieList;