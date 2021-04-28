import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Main from './MyMovies/Main';
import AddMovie from './MyMovies/AddMovie';
import EditMovie from './MyMovies/EditMovie';
import AddEpisode from './MyMovies/AddEpisode';
import EditEpisode from './MyMovies/EditEpisode';
import { Debug } from '../utils/logger';

function MyMovies(props) {
    const location = useLocation();
    const match = useRouteMatch();

    Debug(`[App][MainScreen][My Movies] Render`);

    return (
        <div className="my-movies pt-5">
            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Switch location={location}>
                        <Route path={`${match.path}/add-movie`}>
                            <AddMovie/>
                        </Route>
                        <Route path={`${match.path}/:movieId/edit`}>
                            <EditMovie/>
                        </Route>
                        <Route path={`${match.path}/:movieId/add-episode`}>
                            <AddEpisode/>
                        </Route>
                        <Route path={`${match.path}/:movieId/episodes/:episodeId/edit`}>
                            <EditEpisode/>
                        </Route>
                        <Route path={match.path}>
                            <Main/>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default React.memo(MyMovies);