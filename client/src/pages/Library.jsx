import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Main from './Library/Main';
import AddSection from './Library/AddSection';
import EditSection from './Library/EditSection';
import { Debug } from '../utils/logger';

function Library(props) {
    const location = useLocation();
    const match = useRouteMatch();

    Debug(`[App][MainScreen][Library] Render`);

    return (
        <div className="container-fluid pt-5 library">
            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Switch location={location}>
                        <Route path={`${match.path}/add-section`}>
                            <AddSection/>
                        </Route>
                        <Route path={`${match.path}/edit-section/:id`}>
                            <EditSection/>
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

export default React.memo(Library);