import './assets/scss/styles.scss';
import "swiper/swiper.min.css";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';

import axios from './utils/axios';
import { Debug } from './utils/logger';

import { AppSetLoading, AppSetState } from './store/actions/app.action';
import { UserSignIn, UserFetchData, UserGuestSignIn } from './store/actions/user.action';

import LoginScreen from './pages/LoginScreen';
import MainScreen from './containers/MainScreen';
import Loading from './components/Loading';

function App() {
    const appState = useSelector(state => state.app.appState);
    const loading = useSelector(state => state.app.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        if(appState !== 0) return;

        // Fetch JWT cookie from cookie
        const jwt = Cookies.get('JWT');
        if(jwt) {
            dispatch(AppSetLoading(true));

            axios.post('/auth/verify-token', {
                token: jwt
            }).then(({ data }) => {
                dispatch(AppSetLoading(false));
                dispatch(UserSignIn(data.user.id, data.user.email, jwt));
                dispatch(UserFetchData(true)); // true -> set app state to 2 after fetching done
            }).catch((err) => {
                Cookies.remove('JWT');
                dispatch(AppSetLoading(false));
                dispatch(AppSetState(1));
            })
        } else { // No Key? Not Logged?
            // A little hack
            if(window.location.pathname.startsWith('/shared')) {
                dispatch(AppSetLoading(false));
                dispatch(UserGuestSignIn());
                dispatch(AppSetState(2));

                return;
            }

            dispatch(AppSetState(1));
        }
    }, [appState, dispatch]); // First Load

    Debug(`[App] Render (State: ${appState})`);

    return (
        <div>
            { appState === 1 &&
                <LoginScreen/>
            }
            { appState === 2 &&
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={appState}
                    addEndListener={(node, done) => {
                        node.addEventListener("transitionend", done, false);
                    }}
                    classNames="fade-in"
                >
                    <Router><MainScreen/></Router>
                </CSSTransition>
            </SwitchTransition>
            }
            <CSSTransition in={loading} timeout={250} classNames="anim-slideup-loading" unmountOnExit>
                <Loading/>
            </CSSTransition>
        </div>
    )
}

export default App;