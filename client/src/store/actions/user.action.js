import axios from './../../utils/axios'

import * as Actions from '../actionTypes';
import { AppSetLoading, AppSetState } from './app.action';
import { SeriesSet } from './series.action';
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
            
            const seriesData = result[0].data;
            const moviesData = result[1].data;

            dispatch(SeriesSet(seriesData.series));
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
        payload: { id, email, token}
    }
}

export function UserSignOut() {
    return {
        type: Actions.USER_SIGNOUT
    }
}