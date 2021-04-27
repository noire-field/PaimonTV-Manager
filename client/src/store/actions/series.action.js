import * as Actions from '../actionTypes';

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

export function SeriesSetMine(title, movies) {
    return {
        type: Actions.SERIES_SET_MINE,
        payload: { title, movies }
    }
}
