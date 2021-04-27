import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import ErrorList from '../../components/ErrorList';

import axios from './../../utils/axios';

import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';
import { MoviesSetSingle } from './../../store/actions/movies.action';


function EditEpisode(props) {
    const { movieId, episodeId } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const moviesList = useSelector(state => state.movies.list);
    const userToken = useSelector(state => state.user.user.token);
    
    const movie = moviesList[movieId];

    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState([]);

    const [tempEpisodeId, setTempEpisodeID] = useState(episodeId.substr(2));
    const [title, setTitle] = useState(movie && movie.episodes && movie.episodes[episodeId] ? movie.episodes[episodeId].title : "");
    const [duration, setDuration] = useState(movie && movie.episodes && movie.episodes[episodeId] ? movie.episodes[episodeId].duration: 0);
    const [fileUrl, setFileUrl] = useState(movie && movie.episodes && movie.episodes[episodeId] ? movie.episodes[episodeId].url : "");
    const [status, setStatus] = useState(movie && movie.episodes && movie.episodes[episodeId] ? ([1,3].indexOf(movie.episodes[episodeId].status) !== -1 ? 0 : movie.episodes[episodeId].status) : 0);

    if(!movie) return <Redirect to="/my-movies"/>
    if(!movie.episodes || !movie.episodes[episodeId]) return <Redirect to={`/my-movies/${movieId}/edit`}/>

    const episode = movie.episodes[episodeId];

    const onClickBack = (e) => {
        e.preventDefault();
        history.push(`/my-movies/${movieId}/edit`)
    }

    const onSubmitUpdate = async (e) => {
        e.preventDefault();

        if(title.length <= 0) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.put(`/movies/${movieId}/episodes/${episodeId.substr(2)}`, { title, duration, progress: -1, url: fileUrl, status }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            setUpdated(true);

            episode.title = title;
            episode.duration = duration;
            episode.url = fileUrl;
            episode.status = status;

            dispatch(MoviesSetSingle(movieId, movie));
            dispatch(AppSetLoading(false));
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    const onClickDelete = async (e) => {
        e.preventDefault();

        const deletionCheck = window.confirm("Are you sure?");
        if(!deletionCheck) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.delete(`/movies/${movieId}/episodes/${episodeId.substr(2)}`, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            //history.push(`/my-movies/${movieId}/edit`);
            dispatch(UserFetchData(true));
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    { updated && 
                    <div className="alert alert-success"><i className="far fa-check-circle me-1"></i>Data has been updated!</div>
                    }
                    <ErrorList errors={errors}/>
                    <h5 className="mb-1">Movie: <b>{movie.title}</b></h5>
                    <h3 className="mb-3">Edit Episode: <b>{episode.title}</b></h3>
                    <form onSubmit={onSubmitUpdate}>
                        <div className="row">
                            <div className="col-md-3 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" htmlFor="id">ID</label>
                                    <input type="text" id="id" className="form-control border" value={tempEpisodeId} onChange={(e) => setTempEpisodeID(e.target.value)} readOnly/>
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
                                    <select id="status" className="form-select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
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
                            <div className="col-md-2 mb-2">
                                <button onClick={onClickDelete} className="btn btn-danger btn-block"><i className="fas fa-arrow-circle-left me-1"></i>Delete</button>
                            </div>
                            <div className="col-md-8 mb-2">
                                <button type="submit" className="btn btn-warning btn-block"><i className="fas fa-save me-1"></i>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default React.memo(EditEpisode);