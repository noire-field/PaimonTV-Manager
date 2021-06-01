import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import debounce from 'lodash.debounce';


import VideoPlayer from './../components/WatchScreen/VideoPlayer';
import VideoControl from './../components/WatchScreen/VideoControl';

import { Debug } from '../utils/logger';
import { WatchInit } from '../store/actions/watch.action';


function WatchScreen(props) {
    const { episodeId: id, seriesId } = useParams();
    const [index, episodeId] = id.split('-');

    const dispatch = useDispatch();
    const history = useHistory();

    const movie = useSelector(state => state.shared.movie);
    const playable = useSelector(state => state.watch.playable);

    const [showControls, setShowControls] = useState(true);
    const hideControls = useCallback(debounce(() => { setShowControls(false); }, 1000), [])

    useEffect(() => {
        const listener = document.addEventListener('mousemove', (e) => {
            if(!showControls) setShowControls(true);
            hideControls();
        });

        return () => {
            document.removeEventListener('mousemove', listener);
        }
    }, [showControls])

    useEffect(() => {
        if(movie.episodes[index] && movie.episodes[index].id == episodeId) {
            dispatch(WatchInit(index,  movie.episodes[index], movie));
        } else {
            history.push(`/shared/${seriesId}`);
        }
    }, []);

    const buffering = useSelector(state => state.watch.buffering);

    Debug(`[App][MainScreen][WatchScreen] Render`);

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
                    <VideoControl/>
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