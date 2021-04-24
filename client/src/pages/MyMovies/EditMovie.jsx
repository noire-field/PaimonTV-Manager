import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams, Link } from 'react-router-dom';

import ErrorList from '../../components/ErrorList';

import axios from './../../utils/axios';
import { EpisodesToArray, DurationSecondToText } from './../../utils/movies';

import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';
import { MoviesSetSingle } from './../../store/actions/movies.action';

function EditMovie(props) {
    const { movieId } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const moviesList = useSelector(state => state.movies.list);
    const userToken = useSelector(state => state.user.user.token);
    
    const movie = moviesList[movieId];

    const [title, setTitle] = useState(movie ? movie.title : "");
    const [subTitle, setSubTitle] = useState(movie ? movie.subTitle : "");
    const [thumbnail, setThumbnail] = useState(movie ? movie.thumbnail : "");
    const [year, setYear] = useState(movie ? movie.year : "");

    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState([]);
    
    if(!movie) return <Redirect to="/my-movies"/>

    const onClickBack = (e) => {
        e.preventDefault();
        history.push('/my-movies')
    }

    const onSubmitUpdate = async (e) => {
        e.preventDefault();

        if(title.length <= 0) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            const { data } = await axios.put(`/movies/${movieId}`, { title, subTitle, thumbnail, year }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            setUpdated(true);

            movie.title = title;
            movie.subTitle = subTitle;
            movie.thumbnail = thumbnail;
            movie.year = year;

            dispatch(MoviesSetSingle(movieId, movie));
            dispatch(AppSetLoading(false));
        } catch(err) {
            console.log(err);
            dispatch(AppSetLoading(false));
            //setErrors(err.response.data.errors);
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
            await axios.delete(`/movies/${movieId}`, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            dispatch(UserFetchData(true));
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    const onClickAddEpisode = (e) => {
        e.preventDefault();
        history.push(`/my-movies/${movieId}/add-episode`);
    }

    const episodesArray = EpisodesToArray(movie.episodes);

    const renderedEpisodes = episodesArray.length > 0 ? episodesArray.map((ep) => {
        var progress = 0;

        if(ep.progress > 0 && ep.duration > 0)
            progress = Math.round(ep.progress / ep.duration * 100) 

        var status;
        switch(ep.status) {
            case 0: status = <span className="text-warning">Pending</span>; break;
            case 1: status = <span className="text-danger">Processing</span>; break;
            case 2: status = <span className="text-success">Ready</span>; break;
        }

        return (
            <tr>
                <th scope="row">{ep.id}</th>
                <td className="text-start">
                    <Link to={`/my-movies/${movieId}/episodes/ep${ep.id}/edit`} className="text-white">{ep.title} <span className="small text-danger">Edit</span></Link>
                </td>
                <td>{DurationSecondToText(ep.duration)}</td>
                <td>{progress >= 95 ? 100 : progress}%</td>
                <td><a href={ep.url} target="_blank">Link</a></td>
                <td>{status}</td>
            </tr>
        )
    }) : (
        <tr>
            <td colSpan={6}><p className="mb-0 text-cener">There is no episode</p></td>
        </tr>
    )

    return (
        <div className="container text-white">
            <div className="row mb-5">
                <div className="col-lg-12 text-center">
                    { updated && 
                    <div className="alert alert-success"><i className="far fa-check-circle me-1"></i>Data has been updated!</div>
                    }
                    <ErrorList errors={errors}/>
                </div>
                <div className="col-lg-2 text-center">
                    <img className="editting-thumbnail mb-3" src={movie.thumbnail}/>
                </div>
                <div className="col-lg-8">
                    <h3 className="mb-3">Edit Movie: <b>{movie.title}</b></h3>
                    <form onSubmit={onSubmitUpdate}>
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="title">Title</label>
                                    <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="alt-title">Alternative Title</label>
                                    <input type="text" id="alt-title" className="form-control border" value={subTitle} onChange={(e) => setSubTitle(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="thumbnail">Thumbnail URL</label>
                                    <input type="text" id="thumbnail" className="form-control border" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="year">Year</label>
                                    <input type="text" id="year" className="form-control border" value={year} onChange={(e) => setYear(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 mb-2">
                                <button onClick={onClickBack} className="btn btn-white btn-block"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                            <div className="col-md-2 mb-2">
                                <button onClick={onClickDelete} className="btn btn-danger btn-block"><i class="fas fa-trash-alt me-1"></i>Delete</button>
                            </div>
                            <div className="col-md-8 mb-2">
                                <button type="submit" className="btn btn-warning btn-block"><i class="fas fa-save me-1"></i>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="d-flex justify-content-start align-items-center mb-2">
                        <h3 className="me-2">Movie Episodes</h3>
                        <button onClick={onClickAddEpisode} className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i class="fas fa-plus me-1"></i>Add episode</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover table-bordered table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Progress</th>
                                    <th scope="col">URL</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {renderedEpisodes}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditMovie;