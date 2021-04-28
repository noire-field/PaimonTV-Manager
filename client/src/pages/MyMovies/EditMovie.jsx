import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams, Link } from 'react-router-dom';

import ErrorList from '../../components/ErrorList';

import axios from './../../utils/axios';
import { EpisodesToArray, DurationSecondToText } from './../../utils/movies';
import { SeriesToArray } from './../../utils/series';

import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';
import { MoviesSetSingle } from './../../store/actions/movies.action';
import { Debug } from '../../utils/logger';

function EditMovie(props) {
    const { movieId } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const moviesList = useSelector(state => state.movies.list);
    const userToken = useSelector(state => state.user.user.token);
    const seriesList = useSelector(state => state.series.list);
    
    const movie = moviesList[movieId];
    const series = SeriesToArray(seriesList);

    const [title, setTitle] = useState(movie ? movie.title : "");
    const [subTitle, setSubTitle] = useState(movie ? movie.subTitle : "");
    const [thumbnail, setThumbnail] = useState(movie ? movie.thumbnail : "");
    const [year, setYear] = useState(movie ? movie.year : "");
    const [addSeries, setAddSeries] = useState('my-list');

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
            await axios.put(`/movies/${movieId}`, { title, subTitle, thumbnail, year }, { 
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

    const onSeriesAddMovie = async (e) => {
        e.preventDefault();

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.post(`/series/${addSeries}/movies`, { movieId }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            setUpdated(true);

            //dispatch(MoviesSetSingle(movieId, movie));
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
            case 0: status = <span className="text-primary">Pending</span>; break;
            case 1: status = <span className="text-warning">Processing</span>; break;
            case 2: status = <span className="text-success">Ready</span>; break;
            case 3: status = <span className="text-danger">Processing Failed</span>; break;
            default: status = <span className="text-white">Unknown Status</span>; break;
        }

        return (
            <tr key={ep.id}>
                <th scope="row">{ep.id}</th>
                <td className="text-start">
                    <Link to={`/my-movies/${movieId}/episodes/ep${ep.id}/edit`} className="text-white">{ep.title} <span className="small text-danger">Edit</span></Link>
                </td>
                <td>{DurationSecondToText(ep.duration)}</td>
                <td>{progress >= 95 ? 100 : progress}%</td>
                <td><a href={ep.url} target="_blank" rel="noreferrer">Link</a></td>
                <td>{status}</td>
            </tr>
        )
    }) : (
        <tr key={'zero'}>
            <td colSpan={6}><p className="mb-0 text-cener">There is no episode</p></td>
        </tr>
    )

    Debug(`[App][MainScreen][My Movies][Add Movie] Render`);


    return (
        <div className="container text-white">
            <div className="row mb-5">
                <div className="col-lg-12">
                    { updated && 
                    <div className="alert alert-success"><i className="far fa-check-circle me-1"></i>Data has been updated!</div>
                    }
                    <ErrorList errors={errors}/>
                </div>
                <div className="col-lg-2 text-center">
                    <button onClick={onClickBack} className="btn btn-white btn-block mb-2"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
                    <img className="editting-thumbnail mb-3" alt="Thumbnail" src={movie.thumbnail}/>
                </div>
                <div className="col-lg-10">
                    <h3 className="mb-3">Edit Movie: <b>{movie.title}</b></h3>
                    <form onSubmit={onSubmitUpdate} className="mb-4">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="form mb-2">
                                    <label className="form-label text-white font-weight-bold" htmlFor="title">Title</label>
                                    <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form mb-2">
                                    <label className="form-label text-white font-weight-bold" htmlFor="alt-title">Alternative Title</label>
                                    <input type="text" id="alt-title" className="form-control border" value={subTitle} onChange={(e) => setSubTitle(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form mb-2">
                                    <label className="form-label text-white font-weight-bold" htmlFor="year">Year</label>
                                    <input type="text" id="year" className="form-control border" value={year} onChange={(e) => setYear(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form mb-2">
                                    <label className="form-label text-white font-weight-bold" htmlFor="thumbnail">Thumbnail URL</label>
                                    <input type="text" id="thumbnail" className="form-control border" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form mb-2">
                                    <label className="form-label text-white font-weight-bold" htmlFor="thumbnail">Action</label>
                                    <div className="row">
                                        <div className="col-8 mb-2 mb-lg-0">
                                            <button type="submit" className="btn btn-warning btn-block"><i className="fas fa-save me-1"></i>Save</button>
                                        </div>
                                        <div className="col-4 mb-2 mb-lg-0">
                                            <button onClick={onClickDelete} className="btn btn-danger btn-block"><i className="fas fa-trash-alt me-1"></i>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <h3 className="mb-3">Add To Section</h3>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form mb-2">
                                    <select className="form-select" value={addSeries} onChange={(e) => setAddSeries(e.target.value)}>
                                        <option value='my-list'>My List</option>
                                        { series.map((s) => {
                                            return <option key={s.id} value={s.id}>{s.title}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <button onClick={onSeriesAddMovie} className="btn btn-info btn-block"><i className="fas fa-plus-circle me-1"></i>Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="d-flex justify-content-start align-items-center mb-2">
                        <h3 className="me-2">Movie Episodes</h3>
                        <button onClick={onClickAddEpisode} className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i className="fas fa-plus me-1"></i>Add episode</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered table-dark">
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