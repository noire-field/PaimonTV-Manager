import * as Actions from './../actionTypes';

const initState = {
    loaded: false,
    movie: null
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.SHARED_SET_LOADED:
            return { ...state, loaded: true, movie: action.movie };
        case Actions.SHARED_UPDATE_EPISODE_PROGRESS:
            const movie = {
                ...state.movie,
                episodes: [
                    ...state.movie.episodes
                ]
            }

            movie.episodes[action.payload.episodeIndex].progress = action.payload.progress;

            return { ...state, movie };
        default: return state;
    }
}

export default reducer;