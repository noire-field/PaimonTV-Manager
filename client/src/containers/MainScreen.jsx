import React from 'react';
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Navbar from './../components/Navbar';
import Library from './../pages/Library';
import MyMovies from '../pages/MyMovies';
import Queue from '../pages/Queue';
import Logs from '../pages/Logs';
import WatchScreen from '../pages/WatchScreen';
import { Debug } from '../utils/logger';

function MainScreen(props) {
    const location = useLocation();
    const isGuestWatch = location.pathname.startsWith('/guest-watch') ? true : false;

    Debug(`[App][MainScreen] Render`);
    
    return (
        <div className="main-screen pbg-primary">
            {!isGuestWatch && <Navbar/>}
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
                        <Route path="/guest-watch/:sharedId">
                            <WatchScreen/>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}

export default React.memo(MainScreen);