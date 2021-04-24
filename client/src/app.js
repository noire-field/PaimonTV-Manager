import './assets/scss/styles.scss';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';

import axios from './utils/axios';

import { AppSetLoading, AppSetState } from './store/actions/app.action';
import { UserSignIn, UserFetchData } from './store/actions/user.action';

import LoginScreen from './pages/LoginScreen';
import MainScreen from './containers/MainScreen';
import Loading from './components/Loading';


function App() {
    const appState = useSelector(state => state.app.appState);
    const loading = useSelector(state => state.app.loading);
    const dispatch = useDispatch();

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
                dispatch(UserFetchData(true)); // true -> set app state to 2 after fetching done
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
            }, 500);
        }

        return () => {
            if(timeoutHandler) clearTimeout(timeoutHandler);
        }
    }, [appState]); // First Load

    console.log("[App] Render");

    return (
        <React.Fragment>
            { appState > 0 &&
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={appState}
                    addEndListener={(node, done) => {
                        node.addEventListener("transitionend", done, false);
                    }}
                    classNames="fade-in"
                >
                    { appState == 1 ? <LoginScreen/> : <Router><MainScreen/></Router> }
                </CSSTransition>
            </SwitchTransition>
            }
            <CSSTransition in={loading} timeout={250} classNames="anim-slideup-loading" unmountOnExit>
                <Loading/>
            </CSSTransition>
        </React.Fragment>
    )
}

export default App;