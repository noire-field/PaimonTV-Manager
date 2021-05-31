import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Main from './SeriesDetail/Main';
import WatchScreen from './WatchScreen';

import EpisodeItem from './../components/SeriesDetail/EpisodeItem';

import { Debug } from '../utils/logger';


function SeriesDetail(props) {
    const { seriesId } = useParams();

    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    Debug(`[App][MainScreen][SeriesDetail] Render`);

  

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


export default React.memo(SeriesDetail);