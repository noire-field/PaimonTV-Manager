import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useParams } from 'react-router';
import styled from 'styled-components';


import Main from './SeriesDetail/Main';
import WatchScreen from './WatchScreen';

import { AppSetLoading } from './../store/actions/app.action';

import axios from './../utils/axios';
import { Debug } from '../utils/logger';

import paimonLetter from './../assets/images/paimon-letter.png';
import { SharedSetLoaded } from '../store/actions/shared.action';


function SeriesDetail(props) {
    Debug(`[App][MainScreen][SeriesDetail] Render`);

    const { seriesId } = useParams();

    const location = useLocation();
    const match = useRouteMatch();
    const dispatch = useDispatch();

    const loaded = useSelector(state => state.shared.loaded);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if(loaded) return;

        dispatch(AppSetLoading(true));
        axios.get(`/shared/${seriesId}`).then(({ data }) => {
            dispatch(SharedSetLoaded({...data.movie, id: seriesId }));
            dispatch(AppSetLoading(false));
        }).catch((err) => {
            if(err.response) setErrors(err.response.data.errors);
            else setErrors([{ message: 'Paimon không thể kết nối tới máy chủ :(' }]);

            dispatch(AppSetLoading(false));
        });
    // eslint-disable-next-line
    }, []);
    
    if(errors.length > 0) return (
        <MainContainer>
            <div>
                <Paimon src={paimonLetter}/>
                { errors.map((e, i) => <Error key={i}>{e.message}</Error> )}
            </div>
        </MainContainer>
    )

    if(!loaded) return null;
    
    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <Switch location={location}>
                    <Route path={`${match.path}/watch/:episodeId`}>
                        <WatchScreen/>
                    </Route>
                    <Route path={match.path}>
                        <Main/>
                    </Route>
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
}

const MainContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const Paimon = styled.img`
    height: 300px;
    max-width: 100%;
    margin-bottom: 30px;
`;

const Error = styled.p`
    display: block;
    text-align: center;
    color: white;
    font-size: 2em;
    margin-bottom: 0;
    letter-spacing: 3px;
`;

export default React.memo(SeriesDetail);