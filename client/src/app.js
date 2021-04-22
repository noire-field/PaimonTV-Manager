import { React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './assets/scss/styles.scss';
import { CSSTransition } from 'react-transition-group'

import Login from './pages/Login';
import MainScreen from './containers/MainScreen';
import Loading from './components/Loading';


function App() {
    const appState = useSelector(state => state.app.appState);
    const auth = useSelector(state => state.user.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        switch(appState) {
            case 0: // Not loaded

                break;
        }
    }, []);

    const clickMe = function(e) {
        dispatch({
            type: 'SET_AUTH',
            payload: !auth
        })
    }

    console.log(auth);

    return (
        <div onClick={clickMe}>
            <MainScreen/>
            <CSSTransition in={auth} timeout={250} classNames="my-node" unmountOnExit>
            <Loading/>
            </CSSTransition>
        </div>
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