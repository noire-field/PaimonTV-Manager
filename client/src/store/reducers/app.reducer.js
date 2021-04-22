import * as Actions from './../actionTypes';

const initState = {
    appState: 0,
    loading: false
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.APP_SET_STATE:
            return {
                ...state,
                appState: action.payload
            };
        case Actions.APP_SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        default: return state;
    }
}

export default reducer;