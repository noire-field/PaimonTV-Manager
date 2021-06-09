import * as Actions from './../actionTypes';

const initState = {
    loaded: false
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.HOME_SET_LOADED:
            return { ...state, loaded: true };
        default: return state;
    }
}

export default reducer;