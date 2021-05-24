import React from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

function VideoPlayer(props) {
    return (
        <ControlWrapper>
            ABC
        </ControlWrapper>
    )
}

const ControlWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15%;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
`;

export default React.memo(VideoPlayer);