import * as Actions from './../actionTypes';

const initState = {
    list: []
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.SERIES_SET:
            return {
                ...state,
                list: action.payload
            };
        case Actions.SERIES_SET_SINGLE:
            var list = { ...state.list };
            list[action.payload.id] = action.payload.series;

            return {
                ...state,
                list
            };
        default: return state;
    }
}

export default reducer;