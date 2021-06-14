import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import { WatchSetProgress, WatchSetBuffering, WatchSetPlaying } from './../../store/actions/watch.action';

import { Debug } from '../../utils/logger';
import { useHistory } from 'react-router';

function VideoPlayer(props) {
    Debug(`[App][MainScreen][WatchScreen][VideoPlayer] Render`);

    const dispatch = useDispatch();
    const history = useHistory();

    const playerRef = useRef(null);
    const isPlaying = useSelector(state => state.watch.isPlaying);
    const videoUrl = useSelector(state => state.watch.video.url);
    const seek = useSelector(state => state.watch.seek);
    const volume = useSelector(state => state.watch.volume);
    const movieId = useSelector(state => state.shared.movie.id);
    const isFullScreen = useSelector(state => state.watch.fullscreen);

    useEffect(() => {
        if(!seek.required) return;
        playerRef.current.seekTo(seek.to);
        //dispatch(WatchRequireSeek(false));

        //console.log("Completed Seek: "+ seek.to)
    }, [seek, playerRef]);

    
    /*
    const onStart = () => {
        console.log("Start");
    }

    const onPlay = () => {
        console.log("Play");
    }

    const onPause = () => {
        console.log("Pause");
    }*/

    const onProgress = (data) => {
        dispatch(WatchSetProgress(data.playedSeconds))
    }

    const onBuffer = (data) => { dispatch(WatchSetBuffering(true)); }
    const onBufferEnd = (data) => { dispatch(WatchSetBuffering(false)); }
    const onEnded = () => { 
        dispatch(WatchSetPlaying(false));
        history.push(`/shared/${movieId}`);
    }

    const onToggleFullScreen = () => {
        const element = document.querySelector("#root");

        if(!isFullScreen)
            element.requestFullscreen().then(() => {}).catch((e) => {
                alert("Không thể vào chế độ toàn màn hình, có thể bạn chưa cho phép");
            })
        else document.exitFullscreen();
    }

    return (
        <div onDoubleClick={onToggleFullScreen}>
            <ReactPlayer 
                ref={playerRef}
                style={{ margin: 0, padding: 0, position: 'relative' }} height='100%' width='100%'
                /*onPlay={onPlay} onStart={onStart} onPause={onPause}*/ onProgress={onProgress}  onBuffer={onBuffer} onBufferEnd={onBufferEnd} onEnded={onEnded}
                playing={isPlaying} volume={volume}
                url={videoUrl}
            />
        </div>
    )
}

export default React.memo(VideoPlayer);