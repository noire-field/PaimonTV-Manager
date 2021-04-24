import axios from './../../utils/axios';

import * as Actions from '../actionTypes';
import { AppSetLoading, AppSetState } from './app.action';

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