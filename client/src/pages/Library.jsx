import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Main from './Library/Main';
import AddSection from './Library/AddSection';
import EditSection from './Library/EditSection';

function Library(props) {
    const location = useLocation();
    const match = useRouteMatch();

    return (
        <div className="container-fluid pt-5 library">
            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Switch location={location}>
                        <Route path={`${match.path}/add-section`}>
                            <AddSection/>
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

export default Library;