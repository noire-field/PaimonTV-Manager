import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import styled from 'styled-components';
import ReactImageAppear from 'react-image-appear';

import EpisodeItem from './../../components/SeriesDetail/EpisodeItem';

import { Debug } from '../../utils/logger';


function Main(props) {
    const { seriesId } = useParams();

    const history = useHistory();

    Debug(`[App][MainScreen][SeriesDetail][Main] Render`);

    const onClickWatch = (e) => {
        e.preventDefault();
        history.push(`/shared/${seriesId}/watch/1`);
    }

    return (
        <React.Fragment>
            <Background style={{ 
                background: 'url("https://m.media-amazon.com/images/M/MV5BY2FjMTZhOGUtOTFhOC00NmFmLTkzNmEtNWQ2NWExMjU5OWExXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}/>
            <MainContainer>
                <div className="container py-3">
                    <div className="row">
                        <div className="col-lg-5">
                            <ReactImageAppear src='https://m.media-amazon.com/images/M/MV5BY2FjMTZhOGUtOTFhOC00NmFmLTkzNmEtNWQ2NWExMjU5OWExXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg' className="shadow w-100 bordered" showLoader={false} placeholderStyle={{ backgroundColor: 'transparent' }}/>
                        </div>
                        <div className="col-lg-7 pt-5 text-white">
                            <h1 className="mb-0">Princess Connect! Re:Dive</h1>
                            <Subtitle className="mb-3">プリンセスコネクト！Re:Dive</Subtitle>
                            <h4>2020 <EpisodesText>13 Tập</EpisodesText></h4>
                            <div className="mt-4 d-flex justify-content-start align-items-center">
                                <button onClick={onClickWatch} className="btn btn-danger"><i className="fas fa-play me-2"></i>Xem Phim</button>
                            </div>
                            <h4 className="mt-5">Danh sách tập</h4>
                            <EpisodeList>
                            { new Array(20).fill(10).map((e, i) => {
                                    return <EpisodeItem key={i}/>;
                                })
                            }
                                
                            </EpisodeList>
                        </div>
                    </div>
                </div>
            </MainContainer>
        </React.Fragment>
    );
}

const Background = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    filter: brightness(50%);
`;

const MainContainer = styled.div`
    position: absolute;
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PosterImage = {
    width: '100%',
    border: '1px solid rgba(100,100,100)',
    '-webkit-box-shadow': '0px 0px 14px 0px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '0px 0px 14px 0px rgba(0,0,0,0.75)',
    'box-shadow': '0px 0px 14px 0px rgba(0,0,0,0.75)'
}

const EpisodesText = styled.span`
    background: white;
    color: black;
    padding: 5px 10px;
`;

const Subtitle = styled.h3`
    display: inline-block;
    background: rgba(0,0,0,.5);
    padding: 5px 10px;
`;

const EpisodeList = styled.div`
    width: 100%;
    height: 480px;
    overflow: auto;
`;

export default React.memo(Main);