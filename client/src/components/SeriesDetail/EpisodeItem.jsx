import React from 'react';
import styled from 'styled-components';

import { DurationSecondToText } from './../../utils/movies';

const EpisodeItem = (props) => {
    var remainDuration = DurationSecondToText(400);
    var durationProgress = Math.round((400 / 800) * 100);

    return (
        <EpisodeContainer>
            <EpisodeInfo>
                <h4 className="mb-0">Episode Title</h4>
                <h5 className="mb-0">{durationProgress >= 100 ? '--:--' : remainDuration}</h5>
            </EpisodeInfo>
            <EpisodeProgress style={{ width: `50%` }}></EpisodeProgress>
        </EpisodeContainer>
    )
}

const EpisodeContainer = styled.div`
    position: relative;
    height: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const EpisodeInfo = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    transition: .2s all;

    border-color: rgb(100,100,100);
    background-color: rgba(50,50,50,0.5);

    &:hover {
        cursor: pointer;
        border-color: rgb(100,100,100);
        background-color: rgba(255,255,255,0.5);
    }

    &:active {
        cursor: pointer;
        border-color: rgb(100,100,100);
        background-color: rgba(255,255,255,0.2);
    }

    border-width: 5px;
`;

const EpisodeProgress = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5px;
    background-color: #d9534f;
`;


/*
const styles = StyleSheet.create({
    container: {
        
    },
    wrapper: {
        
    },
    wrapperUnselected: {
        borderColor: 'rgb(100,100,100)',
        backgroundColor: 'rgba(50,50,50,0.5)'
    },
    wrapperSelected: {
        
    },

});*/

export default React.memo(EpisodeItem);