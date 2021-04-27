import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import axios from './../../utils/axios';
import { Debug } from './../../utils/logger';

import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';
import ErrorList from '../../components/ErrorList';

function AddEpisode(props) {
    const { movieId } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const moviesList = useSelector(state => state.movies.list);
    const userToken = useSelector(state => state.user.user.token);
    
    const movie = moviesList[movieId];

    const [episodeId, setEpisodeID] = useState("");
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(0);
    const [fileUrl, setFileUrl] = useState("");
    const [status, setStatus] = useState(0);

    const [errors, setErrors] = useState([]);
    
    if(!movie) return <Redirect to="/my-movies"/>

    const onClickBack = (e) => {
        e.preventDefault();
        history.push(`/my-movies/${movieId}/edit`);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if(episodeId.length <= 0 || title.length <= 0 || fileUrl.length <= 0)
            return;

        dispatch(AppSetLoading(true));

        try {
            await axios.post(`/movies/${movieId}/episodes`, { id: episodeId, title, duration, url: fileUrl, status }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            dispatch(UserFetchData(true));
            history.push(`/my-movies/${movieId}/edit`);
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    Debug(`[App][MainScreen][My Movies][Add Episode] Render`);

    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h5 className="mb-1">Movie: <b>{movie.title}</b></h5>
                    <h3 className="mb-3">Add Episode</h3>
                    <form onSubmit={onSubmit}>
                        <div className="row">
                            <div className="col-md-3 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="id">ID</label>
                                    <input type="text" id="id" className="form-control border" value={episodeId} onChange={(e) => setEpisodeID(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="title">Title</label>
                                    <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-3 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="duration">Duration</label>
                                    <input type="number" id="duration" className="form-control border" min="0" max="99999" value={duration} onChange={(e) => setDuration(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="file-url">File URL</label>
                                    <input type="text" id="file-url" className="form-control border" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="status">Status</label>
                                    <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="0">Required Processing</option>
                                        <option value="2">Ready</option>
                                    </select>
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

export default React.memo(AddEpisode);