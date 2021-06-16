import React, { useMemo } from 'react';
import styled from 'styled-components';

import { DurationSecondToText, ExtractResolutionFromName } from './../../utils/movies';

import { Debug } from '../../utils/logger';

const EpisodeItem = (props) => {
    Debug(`[App][MainScreen][SeriesDetail][Main][EpisodeItem] Render`);

    var remainDuration = DurationSecondToText(props.episode.duration - props.episode.progress);
    var durationProgress = Math.round((props.episode.progress / props.episode.duration) * 100);

    const extractedData = useMemo(() => ExtractResolutionFromName(props.episode.title), [props.episode.title]);

    return (
        <EpisodeContainer onClick={props.onEpisodeClick.bind(this, props.index, props.episode)}>
            <EpisodeInfo>
                <EpisodeTitle className="mb-0">{extractedData.title}</EpisodeTitle>
                <EpisodeMeta>
                    {extractedData.resolution.length > 0 && 
                    <h5 className="mb-0 text-danger">{extractedData.resolution}</h5>}
                    <h5 className="mb-0">{durationProgress >= 100 ? '--:--' : remainDuration}</h5>
                </EpisodeMeta>
            </EpisodeInfo>
            <EpisodeProgress style={{ width: `${durationProgress}%` }}></EpisodeProgress>
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

const EpisodeTitle = styled.h4`
    line-height: 0.85em;
`;

const EpisodeMeta = styled.div`
    display: flex;
    justify-content: space-between;
    min-width: 130px;
`;

export default React.memo(EpisodeItem);