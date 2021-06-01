import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import styled from 'styled-components';
import ReactImageAppear from 'react-image-appear';

import EpisodeItem from './../../components/SeriesDetail/EpisodeItem';

import { ScanMovieEpisodes } from './../../utils/movies';
import { Debug } from '../../utils/logger';
import { WatchReset, WatchSetPlaying } from '../../store/actions/watch.action';

function Main(props) {
    Debug(`[App][MainScreen][SeriesDetail][Main] Render`);

    const { seriesId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const movie = useSelector(state => state.shared.movie);

    const onClickWatch = (e) => {
        e.preventDefault();

        if(movie.episodes.length <= 0) return;
        
        var episodeIndex = ScanMovieEpisodes(movie.episodes)
        onEpisodeClick(episodeIndex, movie.episodes[episodeIndex]);
    }

    const onEpisodeClick = useCallback((index, episode) => {
        history.push(`/shared/${seriesId}/watch/${index}-${episode.id}`);
        dispatch(WatchSetPlaying(true)); // Autoplay by user action
        //if(episode.progress > 3) dispatch(WatchRequireSeek(true, episode.progress));
    }, []);

    useEffect(() => {
        dispatch(WatchReset());
    }, [])

    return (
        <React.Fragment>
            <Background style={{ 
                background: `url('${movie.thumbnail}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}/>
            <MainContainer>
                <div className="container py-3">
                    <div className="row">
                        <div className="col-lg-5 d-flex justify-content-center align-items-center">
                            <ReactImageAppear src={movie.thumbnail} className="shadow w-100 max-width-100 border" showLoader={false} placeholderStyle={{ backgroundColor: 'transparent' }}/>
                        </div>
                        <div className="col-lg-7 pt-5 text-white">
                            <h1 className="mb-0">{movie.title}</h1>
                            <Subtitle className="mb-3">{movie.subTitle}</Subtitle>
                            <h4>{movie.year} <EpisodesText>{movie.episodes.length} Tập</EpisodesText></h4>
                            <div className="mt-4 d-flex justify-content-start align-items-center">
                                <button onClick={onClickWatch} className="btn btn-danger"><i className="fas fa-play me-2"></i>Xem Phim</button>
                            </div>
                            <h4 className="mt-5">Danh sách tập</h4>
                            <EpisodeList>
                            { movie.episodes.map((e, i) => {
                                    return <EpisodeItem key={e.id} index={i} episode={e} onEpisodeClick={onEpisodeClick}/>;
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

/*
const PosterImage = {
    width: '100%',
    border: '1px solid rgba(100,100,100)',
    '-webkit-box-shadow': '0px 0px 14px 0px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '0px 0px 14px 0px rgba(0,0,0,0.75)',
    'box-shadow': '0px 0px 14px 0px rgba(0,0,0,0.75)'
}*/

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