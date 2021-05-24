import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import VideoPlayer from './../components/WatchScreen/VideoPlayer';
import VideoControl from './../components/WatchScreen/VideoControl';

import { Debug } from '../utils/logger';
import axios from './../utils/axios';


import styled from 'styled-components';

function WatchScreen(props) {
    const { sharedId } = useParams();

    Debug(`[App][MainScreen][WatchScreen] Render`);

    return (
        <PlayerContainer>
            <Wrapper>
                <VideoPlayer/>
                <VideoControl/>
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

export default React.memo(WatchScreen);