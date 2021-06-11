import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore/*, compose */} from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import App from './app';
import reducers from './store'
//import config from './config.json';

//const store = createStore(reducers, compose(applyMiddleware(ReduxThunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
const store = createStore(reducers, applyMiddleware(ReduxThunk));

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));