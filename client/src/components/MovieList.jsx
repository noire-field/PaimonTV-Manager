import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import MovieItem from './MovieItem';

function MovieList(props) {
    const renderedItems = props.movies.map((m, index) => {
        return (
            <CSSTransition
                key={index}
                timeout={500}
                classNames="item"
            >
                <MovieItem styles={{...props.styles}} image={m.image}/>
            </CSSTransition>
        );
    })
    return (
        <TransitionGroup className={`movie-list ${props.className}`}>
            {props.preList}
            {renderedItems}
        </TransitionGroup>
    )
}

export default MovieList;