import * as Actions from './../actionTypes';

/*
    0 - Nothing Loaded
    1 - Wait for login
    2 - Logged in
*/
export function AppSetState(state) {
    return {
        type: Actions.APP_SET_STATE,
        payload: state
    }
}

export function AppSetLoading(loading) {
    return {
        type: Actions.APP_SET_LOADING,
        payload: loading
    }
}

