import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import debounce from 'lodash.debounce';


import VideoPlayer from './../components/WatchScreen/VideoPlayer';
import VideoControl from './../components/WatchScreen/VideoControl';

import { Debug } from '../utils/logger';
import { WatchInit, WatchSetFullScreen } from '../store/actions/watch.action';

function WatchScreen(props) {
    Debug(`[App][MainScreen][WatchScreen] Render`);

    const { episodeId: id, seriesId } = useParams();
    const [index, episodeId] = id.split('-');

    const dispatch = useDispatch();
    const history = useHistory();

    // A little hack :)
    const refPlayPause = useRef();
    const refBackward = useRef();
    const refForward = useRef();

    const movie = useSelector(state => state.shared.movie);
    const playable = useSelector(state => state.watch.playable);

    const [showControls, setShowControls] = useState(true);
    // eslint-disable-next-line
    const hideControls = useCallback(debounce(() => { 
        setShowControls(false); 
    }, 3000), [])

    useEffect(() => {
        const onMouseAction = () => {
            if(!showControls) setShowControls(true);
            hideControls();
        }

        document.addEventListener('mousemove', onMouseAction);
        document.addEventListener('click', onMouseAction);
        document.addEventListener('keydown', onKeyboardPress);
        document.addEventListener('fullscreenchange', onFullScreenChange);

        return () => {
            hideControls.cancel();

            document.removeEventListener('mousemove', onMouseAction);
            document.removeEventListener('click', onMouseAction);
            document.removeEventListener('keydown', onKeyboardPress);
            document.removeEventListener('fullscreenchange', onFullScreenChange);
        }
    // eslint-disable-next-line
    }, [showControls])

    const onKeyboardPress = (e) => {
        switch(e.code) {
            case 'Enter':
            case 'Space':
                if(!showControls) setShowControls(true);
                else refPlayPause.current.click();
                break;
            case 'ArrowLeft':
                if(!showControls) setShowControls(true);
                else refBackward.current.click();
                break;
            case 'ArrowRight':
                if(!showControls) setShowControls(true);
                else refForward.current.click();
                break;
            default:
                break;
        }
    }

    const onFullScreenChange = (e) => {
        if (document.fullscreenElement) {
            dispatch(WatchSetFullScreen(true));
        } else {
            dispatch(WatchSetFullScreen(false));
        }
      }

    useEffect(() => {
        // eslint-disable-next-line
        if(movie.episodes[index] && movie.episodes[index].id == episodeId) {
            dispatch(WatchInit(index,  movie.episodes[index], movie));
            document.title = `${movie.title} - PaimonTV`
        } else {
            history.push(`/shared/${seriesId}`);
        }
    // eslint-disable-next-line
    }, []);

    const buffering = useSelector(state => state.watch.buffering);

    if(!playable) return null;

    return (
        <PlayerContainer>
            <Wrapper>
                <VideoPlayer/>
                { buffering && <VideoLoading className="text-white">
                    <div className="loading-icon-wrapper">
                        <i className="fas fa-heart icon-front icon-bigger"></i>
                        <i className="fas fa-heart icon-back icon-bigger"></i>   
                    </div>
                </VideoLoading> }
                <CSSTransition in={showControls} timeout={250} classNames="anim-slideup-loading" unmountOnExit>
                    <VideoControl refPlayPause={refPlayPause} refBackward={refBackward} refForward={refForward}/>
                </CSSTransition>
            </Wrapper>
        </PlayerContainer>
    );
}

const PlayerContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0; 
    width: 100%;
    height: 100%;
`;

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const VideoLoading = styled.div`
    position: absolute;
    top: 0;
    left: 0; 
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,.5);
`;

export default React.memo(WatchScreen);