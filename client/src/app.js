import './assets/scss/styles.scss';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group'
import Cookies from 'js-cookie';

import axios from './utils/axios';

import { AppSetLoading, AppSetState } from './store/actions/app.action';
import { UserSignIn } from './store/actions/user.action';

import LoginScreen from './pages/LoginScreen';
import MainScreen from './containers/MainScreen';
import Loading from './components/Loading';


function App() {
    const appState = useSelector(state => state.app.appState);
    const loading = useSelector(state => state.app.loading);
    const dispatch = useDispatch();

    var renderContent;
    switch(appState) {
        case 0: // Not Loaded anything
            break;
        case 1: // Not logged in
            renderContent = <LoginScreen/>
            break;
        case 2: // Logged in
            renderContent = <MainScreen/>
            break;
    }

    useEffect(async () => {
        if(appState != 0) return;

        dispatch(AppSetLoading(true));

        var timeoutHandler = null;

        // Fetch JWT cookie from cookie
        const jwt = Cookies.get('JWT');
        if(jwt) {
            try {
                const { data } = await axios.post('/auth/verify-token', {
                    token: jwt
                });

                dispatch(AppSetLoading(false));
                dispatch(UserSignIn(data.user.id, data.user.email, jwt));
                dispatch(AppSetState(2));
            } catch(err) {
                Cookies.remove('JWT');
                dispatch(AppSetLoading(false));
                dispatch(AppSetState(1));
            }
        } else { // No Key? Not Logged?
            dispatch(AppSetState(1));

            // Just for fun, LOL!
            timeoutHandler = setTimeout(() => {
                dispatch(AppSetLoading(false));
            }, 1000);
        }

        return () => {
            if(timeoutHandler) clearTimeout(timeoutHandler);
        }
    }, [appState]); // First Load

    console.log("[App] Render");

    return (
        <React.Fragment>
            {renderContent}
            <CSSTransition in={loading} timeout={250} classNames="my-node" unmountOnExit>
                <Loading/>
            </CSSTransition>
        </React.Fragment>
    )
    /*
    return (
        <Router>
            <div>
                <nav>
                <ul>
                    <li>
                    <Link to="/">Home</Link>
                    </li>
                    <li>
                    <Link to="/about">About</Link>
                    </li>
                    <li>
                    <Link to="/users">Users</Link>
                    </li>
                </ul>
                </nav>

            
                <Switch>
                <Route path="/about">
                    <div>This is about</div>
                </Route>
                <Route path="/users">
                    <div>This is user</div>
                </Route>
                <Route path="/">
                    <div>This is home</div>
                </Route>
                </Switch>
            </div>
        </Router>
    )*/
}

export default App;