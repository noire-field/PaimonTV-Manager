import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Slider from '@material-ui/core/Slider';
import ReactPlayer from 'react-player';
import styled from 'styled-components';


function VideoPlayer(props) {
    return (
        <Container>
            <Wrapper>
                <VideoSlider/>
                <Controls>
                    <div>
                        ANIME NAME
                    </div>
                    <PlayPauseButton className="fas fa-play"></PlayPauseButton>
                    <div>
                        PASS TIME
                    </div>
                </Controls>
            </Wrapper>
        </Container>
    )
}

const VideoSlider = withStyles({
    root: {
        color: 'red'
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
    height: 15%;
    color: white;
`;

const Wrapper = styled.div`
    padding: 5px 20px;
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
    margin-top: 10px;
    transition: .2s all;
    font-size: 2em;
    color: white;

    :hover {
        transform: scale(1.1);
    }
`

export default React.memo(VideoPlayer);