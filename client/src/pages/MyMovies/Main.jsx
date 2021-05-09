import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import MovieList from './../../components/MovieList';
import MovieItem from './../../components/MovieItem';

import { MoviesToArray } from '../../utils/movies';

import thumbnailAdd from './../../assets/images/thumbnail-add.jpg';
import { Debug } from '../../utils/logger';

function Main(props) {
    const history = useHistory();
    const movieList = useSelector(state => state.movies.list);

    const moviesArray = MoviesToArray(movieList);

    const onClickAdd = useCallback(() => {
        history.push(`/my-movies/add-movie`);
    }, [history])

    const onMovieClick = useCallback((movieId) => {
        history.push(`/my-movies/${movieId}/edit`);
    }, [history]);

    Debug(`[App][MainScreen][My Movies][Main] Render`);

    return (
        <React.Fragment>
            <h3 className="text-white ms-2 me-2 text-center">My Movies</h3>
            <MovieList movies={moviesArray} className="flex-wrap justify-content-center sm-two-col" onMovieClick={onMovieClick} preList={<MovieItem image={thumbnailAdd} onClick={onClickAdd}/>}/>
        </React.Fragment>
    );
}

export default React.memo(Main);