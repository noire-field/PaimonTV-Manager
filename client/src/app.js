import { React } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './assets/scss/styles.scss';

import MainScreen from './containers/MainScreen';


function App() {

    return <MainScreen/>
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