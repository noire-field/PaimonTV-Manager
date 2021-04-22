import { combineReducers } from 'redux';

import appReducer from './reducers/app.reducer';
import userReducer from './reducers/user.reducer';


export default combineReducers({
    app: appReducer,
    user: userReducer
});