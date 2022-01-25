import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Swiper, SwiperSlide } from 'swiper/react';

import MovieItem from './MovieItem';

function MovieListScroll(props) {
    const renderedItems = props.movies.map((m, index) => {
        return (
            <SwiperSlide className="swipe-movie-item">
                <CSSTransition
                    key={index}
                    timeout={500}
                    classNames="item"
                >
                    <MovieItem key={m.id} styles={{...props.styles}} id={m.id} image={m.thumbnail} onClick={props.onMovieClick} episodeInfo={`${m.episodeCount} Tập`}/>
                </CSSTransition>
            </SwiperSlide>
        );
    })

    return (
        <Swiper slidesPerView='auto' spaceBetween={0}>
            <TransitionGroup className={props.className}>
                {renderedItems}
            </TransitionGroup>
        </Swiper>
    )
}



export default React.memo(MovieListScroll);