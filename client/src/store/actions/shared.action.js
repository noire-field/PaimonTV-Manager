import * as Actions from '../actionTypes';
import cookie from 'js-cookie';

export function SharedSetLoaded(data) {
    const movie = data;

    movie.episodes.forEach((ep, index) => {
        const epProgress = cookie.get(`${movie.id}/${index}`);
        ep.progress = epProgress ? epProgress : 0;
    });

    return {
        type: Actions.SHARED_SET_LOADED,
        movie
    }
}

export function SharedUpdateEpisodeProgress(episodeIndex, progress) {
    return (dispatch, getState) => {
        const movie = getState().shared.movie;

        cookie.set(`${movie.id}/${episodeIndex}`, progress, { expires: 30 });
        dispatch(SharedUpdateEpisodeProgressTrue(episodeIndex, progress));
    }
}

export function SharedUpdateEpisodeProgressTrue(episodeIndex, progress) {
    cookie.set('')

    return {
        type: Actions.SHARED_UPDATE_EPISODE_PROGRESS,
        payload: {
            episodeIndex,
            progress
        }
    };
}