import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';

import { withStyles } from "@material-ui/core/styles";
import Slider from '@material-ui/core/Slider';
import styled from 'styled-components';

import { DurationSecondToText } from './../../utils/movies';
import { WatchRequireSeek, WatchSetMuted, WatchSetPlaying, WatchSetProgress, WatchSetVolume } from './../../store/actions/watch.action'

import { Debug } from '../../utils/logger';



function VideoPlayer(props) {
    Debug(`[App][MainScreen][WatchScreen][VideoControl] Render`);

    const dispatch = useDispatch();

    const [sliding, setSliding] = useState(false);
    const [progress, setProgress] = useState(0);

    const isPlaying = useSelector(state => state.watch.isPlaying);
    const video = useSelector(state => state.watch.video); 
    const volume = useSelector(state => state.watch.volume); 
    const muted = useSelector(state => state.watch.muted); 

    const onTogglePlay = () => {
        dispatch(WatchSetPlaying(!isPlaying));
    }

    const onSliderChange = (event, value) => {
        if(!sliding) setSliding(true);

        setProgress(value);
        onVideoSeek(value);
    }

    const OnVolumeSliderChange = (event, value) => {
        onVideoVolume(value);
    }

    const onVideoSeek = useCallback(debounce((to) => {
        setSliding(false);
        dispatch(WatchRequireSeek(true, to));
        dispatch(WatchSetProgress(to));
    }, 500), []);

    const onVideoVolume = useCallback(debounce((volume) => {
        dispatch(WatchSetVolume(volume));
    }, 10), []);

    const onClickFullScreen = () => {
        document.querySelector("#root").requestFullscreen();
    }

    return (
        <Container>
            <Wrapper>
                <VideoSlider value={sliding ? progress : video.progress} onChange={onSliderChange} max={1420} step={1}/>
                <Controls>
                    <ControlsStart>
                        <SeriesTitle>Monster Girl Doctor</SeriesTitle>
                        <EpisodeTitle>Episode #1 [1080p]</EpisodeTitle>
                    </ControlsStart>
                    <ControlsCenter>
                        <PlayPauseButton onClick={onTogglePlay} className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></PlayPauseButton>
                    </ControlsCenter>
                    <ControlsEnd>
                        <VolumeIcon className={`fas ${ muted || volume <= 0 ? 'fa-volume-mute' : volume >= 0.35 ? 'fa-volume-up' : 'fa-volume-down' }`}></VolumeIcon>
                        <VolumeSlider min={0} max={1} step={0.1} value={muted ? 0 : volume} onChange={OnVolumeSliderChange}/>
                        <VideoTimer>{ DurationSecondToText(sliding ? progress : video.progress) } <span className="text-muted">/</span> { DurationSecondToText(video.duration) }</VideoTimer>
                        <FullScreenButton onClick={onClickFullScreen} className="fas fa-expand"></FullScreenButton>
                    </ControlsEnd>
                </Controls>
            </Wrapper>
        </Container>
    )
}

const VideoSlider = withStyles({
    root: {
        color: 'red',
    },
    thumb: {
        transform: 'scale(1.5)'
    },
    rail: {
        transform: 'scaleY(2)'
    }
})(Slider);

const VolumeSlider = withStyles({
    root: {
        color: 'white',
        marginRight: '15px',
        width: '100px'
    },
    thumb: {
        transform: 'scale(1.5)'
    },
    rail: {
        transform: 'scaleY(2)'
    }
})(Slider);

const Container = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    color: white;
`;

const Wrapper = styled.div`
    padding-left: 35px;
    padding-right: 35px;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
    width: 100%;
    height: 100%
`;

const Controls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PlayPauseButton = styled.i`
    transition: .2s all;
    font-size: 2em;
    color: white;

    :hover {
        transform: scale(1.1);
        cursor: pointer;
    }
`

const ControlsStart = styled.div`
    width: 40%;
`;

const ControlsCenter = styled.div`
    text-align: center;
    width: 20%;
`;

const ControlsEnd = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 40%;
`;

const FullScreenButton = styled.i`
    transition: .2s all;
    font-size: 2em;
    color: white;

    :hover {
        transform: scale(1.1);
        cursor: pointer;
    }
`;

const VideoTimer = styled.p`
    margin-right: 15px;
    padding-top: 15px;
`;

const SeriesTitle = styled.p`
    font-weight: bold;
    margin-bottom: 0;
    line-height: 1;
`;

const EpisodeTitle = styled.p`
    margin-bottom: 0;
`;

const VolumeIcon = styled.i`
    margin-right: 12.5px;
    color: white;
    font-size: 1.25em;
`;

export default React.memo(VideoPlayer);