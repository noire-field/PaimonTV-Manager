import * as Actions from '../actionTypes';
import { SharedUpdateEpisodeProgress } from './shared.action';

export function WatchInit(index, episode, movie) {
    return {
        type: Actions.WATCH_INIT,
        payload: {
            index,
            episode, movie
        }
    }
}

export function WatchSetPlaying(playing) {
    return {
        type: Actions.WATCH_SET_PLAYING,
        playing
    }
}

export function WatchSetProgress(progress) {
    return (dispatch, getState) => {
        const playingVideo = getState().watch.video;

        dispatch(SharedUpdateEpisodeProgress(playingVideo.index, progress));
        dispatch(WatchSetProgressTrue(progress));
    }
}

export function WatchSetProgressTrue(progress) {
    return {
        type: Actions.WATCH_SET_PROGRESS,
        progress
    }
}

export function WatchRequireSeek(required, to=0) {
    return {
        type: Actions.WATCH_REQUIRE_SEEK,
        payload: {
            required, to
        }
    }
}

export function WatchSetBuffering(buffering) {
    return {
        type: Actions.WATCH_SET_BUFFERING,
        buffering
    }
}

export function WatchSetVolume(volume) {
    return {
        type: Actions.WATCH_SET_VOLUME,
        volume
    }
}

export function WatchReset() {
    return {
        type: Actions.WATCH_RESET
    }
}