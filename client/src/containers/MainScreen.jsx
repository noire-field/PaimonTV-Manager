import React from 'react';
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Navbar from './../components/Navbar';
import Library from './../pages/Library';
import MyMovies from '../pages/MyMovies';
import Queue from '../pages/Queue';
import Logs from '../pages/Logs';
import { Debug } from '../utils/logger';

function MainScreen(props) {
    const location = useLocation();

    Debug(`[App][MainScreen] Render`);
    
    return (
        <div className="main-screen pbg-primary">
            <Navbar/>
            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade-in" timeout={300}>
                    <Switch location={location}>
                        <Route exact path="/">
                            <Redirect to="/library"/>
                        </Route>
                        <Route path="/library">
                            <Library/>
                        </Route>
                        <Route path="/my-movies">
                            <MyMovies/>
                        </Route>
                        <Route path="/queue">
                            <Queue/>
                        </Route>
                        <Route path="/logs">
                            <Logs/>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}

export default React.memo(MainScreen);