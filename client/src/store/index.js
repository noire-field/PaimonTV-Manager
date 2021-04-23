import { combineReducers } from 'redux';

import appReducer from './reducers/app.reducer';
import userReducer from './reducers/user.reducer';
import seriesReducer from './reducers/series.reducer';

export default combineReducers({
    app: appReducer,
    user: userReducer,
    series: seriesReducer
});