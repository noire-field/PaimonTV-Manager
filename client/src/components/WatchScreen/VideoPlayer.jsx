import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import { WatchSetProgress, WatchRequireSeek, WatchSetBuffering, WatchSetPlaying } from './../../store/actions/watch.action';

import { Debug } from '../../utils/logger';

function VideoPlayer(props) {
    Debug(`[App][MainScreen][WatchScreen][VideoPlayer] Render`);

    const dispatch = useDispatch();

    const playerRef = useRef(null);
    const isPlaying = useSelector(state => state.watch.isPlaying);
    const seek = useSelector(state => state.watch.seek);
    const volume = useSelector(state => state.watch.volume);

    useEffect(() => {
        if(!seek.required) return;
        playerRef.current.seekTo(seek.to);
        //dispatch(WatchRequireSeek(false));

        console.log("Completed Seek: "+ seek.to)
    }, [seek, playerRef]);

    

    const onStart = () => {
        console.log("Start");
    }

    const onPlay = () => {
        console.log("Play");
    }

    const onPause = () => {
        console.log("Pause");
    }

    const onProgress = (data) => {
        dispatch(WatchSetProgress(data.playedSeconds))
        //console.log(data);
    }

    const onBuffer = (data) => { dispatch(WatchSetBuffering(true)); }
    const onBufferEnd = (data) => { dispatch(WatchSetBuffering(false)); }
    const onEnded = () => { dispatch(WatchSetPlaying(false)); }

    return (
        <ReactPlayer 
            ref={(playerRef)}
            style={{ margin: 0, padding: 0, position: 'relative' }} height='99%' width='100%'
            onPlay={onPlay} onStart={onStart} onProgress={onProgress} onPause={onPause} onBuffer={onBuffer} onBufferEnd={onBufferEnd} onEnded={onEnded}
            playing={isPlaying} volume={volume}
            url='https://storage.googleapis.com/paimontv/users/bm9pcmVmaWVsZEBnbWFpbC5jb20=/86edfc18-6e13-4f40-a11f-8eab72a25303'
        />
    )
}

export default React.memo(VideoPlayer);