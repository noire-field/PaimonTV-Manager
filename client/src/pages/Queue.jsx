import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import QueueItem from './../components/QueueItem';
import QueueProcessor from './../components/QueueProcessor';
import ErrorList from './../components/ErrorList';

import { AppSetLoading } from './../store/actions/app.action';

import axios from './../utils/axios';
import { Debug } from '../utils/logger';

function Queue(props) {
    const dispatch = useDispatch();
    const [processing, setProcessing] = useState(null);
    const [processors, setProcessors] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if(processing !== null)
            return;

        dispatch(AppSetLoading(true));
        axios.get('/queue').then(({ data }) => {
            setProcessing(data.processing);
            setProcessors(data.processors);
            dispatch(AppSetLoading(false));
        }).catch((err) => {
            setErrors(err.response.data.errors);
            dispatch(AppSetLoading(false));
        })
    }, [dispatch, processing]);

    Debug(`[App][MainScreen][Queue] Render`);

    return (
        <div className="container queue text-white pt-5">
            <ErrorList errors={errors}/>
            <div className="row">
                <div className="col-md-10">
                    <h4 className="mb-2">Processing</h4>
                    <div className="row mb-3">
                        { processing && processing.filter((q) => q.status > 0).map((q, i) => {
                            return (
                                <div key={i} className="col-md-6 mb-3">
                                    <QueueItem item={q} orderId={i}/>
                                </div>
                            )
                        })}
                        { (!processing || processing.length <= 0) && 
                        <p className="mb-0 text-white">Processors are ready</p> 
                        }
                    </div>
                    <h4 className="mb-2">Queue</h4>
                    <div className="row mb-3">
                        { processing && processing.filter((q) => q.status <= 0).map((q, i) => {
                            return (
                                <div key={i} className="col-md-6 mb-3">
                                    <QueueItem item={q} orderId={i}/>
                                </div>
                            )
                        })}
                        { (!processing || processing.length <= 0) && 
                        <p className="mb-0 text-white">There is nothing in queue</p> 
                        }
                    </div>
                </div>
                <div className="col-md-2">
                    <h4 className="mb-2">Processors</h4>
                    <div className="row">
                        { processors && processors.map((p, i) => {
                            return (
                                <div key={i} className="col-md-12 mb-3">
                                    <QueueProcessor item={p}/>
                                </div>
                            )
                        })}
                        { (!processors || processors.length <= 0) && 
                        <p className="mb-0 text-white">There is no processor</p> 
                        }
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default React.memo(Queue);