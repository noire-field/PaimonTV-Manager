import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import axios from './../../utils/axios';
import { Debug } from './../../utils/logger';

import ErrorList from './../../components/ErrorList';
import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';


function AddMovie(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.user.token);

    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [year, setYear] = useState('');

    const [errors, setErrors] = useState([]);

    const onClickBack = (e) => {
        e.preventDefault();
        history.push('/my-movies')
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if(title.length <= 0 || thumbnail.length <= 0 || year.length <= 0)
            return;

        dispatch(AppSetLoading(true));

        try {
            await axios.post('/movies', { title, subTitle, thumbnail, year }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            dispatch(UserFetchData(true));
            history.push('/my-movies')
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    Debug(`[App][MainScreen][My Movies][Add Movie] Render`);

    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h3 className="mb-3">Add A Movie</h3>
                    <form onSubmit={onSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="title">Title</label>
                                    <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="alt-title">Alternative Title</label>
                                    <input type="text" id="alt-title" className="form-control border" value={subTitle} onChange={(e) => setSubTitle(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="thumbnail">Thumbnail URL</label>
                                    <input type="text" id="thumbnail" className="form-control border" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="year">Year</label>
                                    <input type="text" id="year" className="form-control border" value={year} onChange={(e) => setYear(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 mb-2">
                                <button onClick={onClickBack} className="btn btn-white btn-block"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                            <div className="col-md-10 mb-2">
                                <button type="submit" className="btn btn-danger pbg-accent btn-block"><i className="fas fa-plus-circle me-1"></i>Add</button>
                            </div>
                        </div>
                    </form>
                    <ErrorList errors={errors}/>
                </div>
            </div>
        </div>
    )
}

export default React.memo(AddMovie);