import * as Actions from './../actionTypes';

const initState = {
    list: [],
    myList: {}
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
        case Actions.SERIES_SET_MINE:
            return {
                ...state,
                myList: { title: action.payload.title, movies: action.payload.movies }
            };
        default: return state;
    }
}

export default reducer;