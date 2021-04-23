import React from 'react';
import ReactImageAppear from 'react-image-appear';

function MovieItem(props) {
    return (
        <div className="movie-item">
            <ReactImageAppear src={props.image} className="shadow" showLoader={false} placeholderStyle={{ backgroundColor: 'black' }}/>
        </div>
    )
}

export default MovieItem;