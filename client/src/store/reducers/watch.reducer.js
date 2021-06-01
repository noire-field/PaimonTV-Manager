import { GetEpisodeCompletedRate } from '../../utils/movies';
import * as Actions from './../actionTypes';

const initState = {
    playable: false,
    isPlaying: false,
    buffering: false,
    seek: {
        required: false,
        to: 0
    },
    video: {
        index: 0,
        title: "",
        seriesTitle: "",
        url: "",
        progress: 0.0,
        duration: 1420,
    },
    volume: 1.0
}

const reducer = function(state = initState, action) {
    var video; 

    switch(action.type) {
        case Actions.WATCH_INIT:
            video = {
                index: Number(action.payload.index), // Episode index in array
                title: action.payload.episode.title,
                seriesTitle: action.payload.movie.title,
                url: action.payload.episode.url,
                progress: 0.0,
                duration: action.payload.episode.duration,
            }

            const seek = {
                required: false,
                to: action.payload.episode.progress
            }

            if(action.payload.episode.progress > 5 && GetEpisodeCompletedRate(action.payload.episode) <= 92)
                seek.required = true

            return { ...state, video, seek, playable: true };
        case Actions.WATCH_SET_PLAYING:
            return { ...state, isPlaying: action.playing };
        case Actions.WATCH_SET_PROGRESS:
            video = { ... state.video, progress: action.progress }
            return { ...state, video };
        case Actions.WATCH_REQUIRE_SEEK:
            return { ...state, seek: { required: action.payload.required, to: action.payload.to }};
        case Actions.WATCH_SET_BUFFERING:
            return { ...state, buffering: action.buffering };
        case Actions.WATCH_SET_VOLUME:
            return { ...state, volume: action.volume };
        case Actions.WATCH_RESET:
            let volume = state.volume;
            return { ...initState, volume };
        default: return state;
    }
}

export default reducer;