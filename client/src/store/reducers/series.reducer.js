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
        default: return state;
    }
}

export default reducer;