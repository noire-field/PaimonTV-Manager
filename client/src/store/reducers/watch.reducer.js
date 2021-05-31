import * as Actions from './../actionTypes';

const initState = {
    isPlaying: false,
    buffering: false,
    seek: {
        required: false,
        to: 0
    },
    video: {
        title: "",
        seriesTitle: "",
        url: "",
        progress: 0.0,
        duration: 1420,
    },
    volume: 1.0
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.WATCH_SET_PLAYING:
            return { ...state, isPlaying: action.playing };
        case Actions.WATCH_SET_PROGRESS:
            const video = { ... state.video, progress: action.progress }
            return { ...state, video };
        case Actions.WATCH_REQUIRE_SEEK:
            return { ...state, seek: { required: action.payload.required, to: action.payload.to }};
        case Actions.WATCH_SET_BUFFERING:
            return { ...state, buffering: action.buffering };
        case Actions.WATCH_SET_VOLUME:
            return { ...state, volume: action.volume };
        default: return state;
    }
}

export default reducer;