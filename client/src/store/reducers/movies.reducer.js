import * as Actions from './../actionTypes';

const initState = {
    list: []
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.MOVIES_SET:
            return {
                ...state,
                list: action.payload
            };
        case Actions.MOVIES_SET_SINGLE:
            var list = { ...state.list };
            list[action.payload.id] = action.payload.movie;

            return {
                ...state,
                list
            };
        default: return state;
    }
}

export default reducer;