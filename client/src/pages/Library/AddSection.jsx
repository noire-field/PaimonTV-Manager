import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import ErrorList from './../../components/ErrorList'

import { AppSetLoading } from './../../store/actions/app.action'
import axios from './../../utils/axios';

import axois from './../../utils/axios';
import Logger from './../../utils/logger';

function AddSection(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.user.token);
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState([]);

    const onClickBack = (e) => {
        e.preventDefault();
        history.goBack();
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if(title.length <= 0) return;

        dispatch(AppSetLoading(true));

        try {
            const { data } = await axios.post('/series', { title }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            dispatch(AppSetLoading(false));
            history.goBack();
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    Logger.Debug(`[App][MainScreen][Library][Add Section] Render`);

    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <h3 className="mb-3">Add A Section</h3>
                    <form onSubmit={onSubmit}>
                        <div className="form mb-4">
                            <label className="form-label text-white font-weight-bold" htmlFor="title">Section Title</label>
                            <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={64} required/>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-2">
                                <button type="submit" className="btn btn-danger pbg-accent btn-block"><i className="fas fa-plus-circle me-1"></i>Add</button>
                            </div>
                            <div className="col-md-4 mb-2">
                                <button onClick={onClickBack} className="btn btn-white btn-block"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                        </div>
                    </form>
                    <ErrorList errors={errors}/>
                </div>
            </div>
        </div>
    );
}

export default React.memo(AddSection);