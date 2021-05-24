import axios from './../../utils/axios';
import { MapMoviesIntoSeries } from './../../utils/series';

import * as Actions from '../actionTypes';
import { AppSetLoading, AppSetState } from './app.action';
import { SeriesSet, SeriesSetMine } from './series.action';
import { MoviesSet } from './movies.action';

export function UserFetchData(redirect = false) {
    return async (dispatch, getState) => {
        var userState = getState().user;

        dispatch(AppSetLoading(true));

        try {
            const axiosOptions = {
                headers: {
                    Authorization: `Bearer ${userState.user.token}`
                }
            }
            const promises = [
                axios.get('/series', axiosOptions),
                axios.get('/movies', axiosOptions)
            ]

            const result = await Promise.all(promises);
            
            const seriesData = MapMoviesIntoSeries(result[0].data.series, result[1].data.movies);
            const myListData = MapMoviesIntoSeries(result[0].data.myList, result[1].data.movies, true);
            const moviesData = result[1].data;

            dispatch(SeriesSet(seriesData));
            dispatch(SeriesSetMine('My List', myListData));
            dispatch(MoviesSet(moviesData.movies));
        } catch(e) {
            
        }

        dispatch(AppSetLoading(false));
        if(redirect) dispatch(AppSetState(2));
    };
}

export function UserSignIn(id, email, token) {
    return {
        type: Actions.USER_SIGNIN,
        payload: { id, email, token }
    }
}

export function UserGuestSignIn() {
    return {
        type: Actions.USER_GUESTSIGNIN
    }
}

export function UserSignOut() {
    return {
        type: Actions.USER_SIGNOUT
    }
}