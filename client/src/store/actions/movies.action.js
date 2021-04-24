import * as Actions from '../actionTypes';

export function MoviesSet(movies) {
    return {
        type: Actions.MOVIES_SET,
        payload: movies
    }
}

export function MoviesSetSingle(id, movie) {
    return {
        type: Actions.MOVIES_SET_SINGLE,
        payload: { id, movie }
    }
}