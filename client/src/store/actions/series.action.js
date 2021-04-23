import axios from './../../utils/axios';

import * as Actions from '../actionTypes';
import { AppSetLoading, AppSetState } from './app.action';

export function SeriesFetch(redirect=false) {
    return async (dispatch, getState) => {
        var userState = getState().user;

        dispatch(AppSetLoading(true));

        try {
            const { data } = await axios.get('/series', {
                headers: {
                    Authorization: `Bearer ${userState.user.token}`
                }
            })

            dispatch(SeriesSet(data.series));
        } catch(e) {
            
        }

        dispatch(AppSetLoading(false));
        if(redirect) dispatch(AppSetState(2));
    };
}

export function SeriesSet(series) {
    return {
        type: Actions.SERIES_SET,
        payload: series
    }
}

export function SeriesSetSingle(id, series) {
    return {
        type: Actions.SERIES_SET_SINGLE,
        payload: { id, series }
    }
}