import React from 'react';

function MovieItem(props) {
    return (
        <div className="movie-item">
            <img src={props.image} className="shadow"/>
        </div>
    )
}

export default MovieItem;