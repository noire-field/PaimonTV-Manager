import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LogItem from '../components/LogItem';
import { Debug } from '../utils/logger';
import ErrorList from './../components/ErrorList';

import { AppSetLoading } from './../store/actions/app.action';

import axios from './../utils/axios';

function Logs(props) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);

    const [logs, setLogs] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if(logs !== null)
            return;

        dispatch(AppSetLoading(true));
        axios.get('/logs', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then(({ data }) => {
            setLogs(data.logs);
            dispatch(AppSetLoading(false));
        }).catch((err) => {
            setErrors(err.response.data.errors);
            dispatch(AppSetLoading(false));
        })
    }, [dispatch, logs, user.token]);

    Debug(`[App][MainScreen][Logs] Render`);


    return (
        <div className="container queue text-white pt-5">
            <ErrorList errors={errors}/>
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-2">Last 20 Logs</h4>
                    <div className="row mb-3">
                        { logs && logs.map((l, i) => {
                            return (
                                <div key={i} className="col-md-12 mb-2">
                                    <LogItem log={l}/>
                                </div>
                            )
                        })}
                        { (!logs || logs.length <= 0) && 
                        <p className="mb-0 text-white">There is no log</p> 
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Logs);