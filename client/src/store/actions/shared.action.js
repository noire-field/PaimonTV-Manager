import * as Actions from '../actionTypes';

export function WatchSetPlaying(playing) {
    return {
        type: Actions.WATCH_SET_PLAYING,
        playing
    }
}