import * as Actions from '../actionTypes';

export function WatchSetPlaying(playing) {
    return {
        type: Actions.WATCH_SET_PLAYING,
        playing
    }
}

export function WatchSetProgress(progress) {
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