import axios from './../../utils/axios';

import * as Actions from '../actionTypes';
import { AppSetLoading } from './app.action';

export function SeriesFetch() {
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
    };
}

export function SeriesSet(series) {
    return {
        type: Actions.SERIES_SET,
        payload: series
    }
}