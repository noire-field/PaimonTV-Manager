import React from 'react';
import ReactImageAppear from 'react-image-appear';

function MovieItem(props) {
    const onClick = (e) => {
        e.preventDefault();
        if(props.onClick)
            props.onClick(props.id);
    }

    return (
        <div className="movie-item" onClick={onClick}>
            <ReactImageAppear src={props.image} className="shadow" showLoader={false} placeholderStyle={{ backgroundColor: 'black' }}/>
            { props.episodeInfo && 
                <p className="movie-episode-info">{props.episodeInfo}</p>
            }
        </div>
    )
}

export default React.memo(MovieItem);