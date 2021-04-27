import React, { useCallback, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import axios from './../../utils/axios';
import { SeriesMoviesToArray } from './../../utils/series';

import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';
import { SeriesSetSingle } from './../../store/actions/series.action';

import MovieList from './../../components/MovieList';
import MovieItem from './../../components/MovieItem';
import ErrorList from './../../components/ErrorList';

function EditSection(props) {
    const { id } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const seriesList = useSelector(state => state.series.list);
    const myList = useSelector(state => state.series.myList);
    const userToken = useSelector(state => state.user.user.token);
    
    const series = id !== 'my-list' ? seriesList[id] : myList;

    const [title, setTitle] = useState(series ? series.title : "");
    const [movieEditMode, setMovieEditMode] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState([]);

    const movies = series && series.movies ? SeriesMoviesToArray(series.movies) : [];

    const onMovieClick = useCallback((movieId) => {
        if(!series.movies[movieId]) {
            alert("This movie can not be found, refresh and try again");
            return;
        }

        setSelectedMovie({
            id: movieId,
            data: series.movies[movieId].data
        });
        setMovieEditMode(true);
    }, [series]);
    
    if(!series) return <Redirect to="/library"/>


    const onBack = (e) => {
        e.preventDefault();

        if(movieEditMode) {
            setMovieEditMode(false);
            setSelectedMovie(null);
        } else history.goBack();
    }

    const onSubmitUpdate = async (e) => {
        e.preventDefault();

        if(title.length <= 0) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.put(`/series/${id}`, { title }, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            setUpdated(true);

            series.title = title;

            dispatch(SeriesSetSingle(id, series));
            dispatch(AppSetLoading(false));
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    const onSectionDelete = async (e) => {
        e.preventDefault();

        const deletionCheck = window.confirm("Are you sure?");
        if(!deletionCheck) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.delete(`/series/${id}`, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            dispatch(UserFetchData(true));
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    const onSectionRemoveMovie = async (e) => {
        e.preventDefault();

        if(!selectedMovie) 
            return;

        const deletionCheck = window.confirm("Are you sure?");
        if(!deletionCheck) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.delete(`/series/${id}/movies/${selectedMovie.id}`, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            dispatch(UserFetchData(true));
            setMovieEditMode(false);
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    const editMovieLayout = selectedMovie && (
        <div>
            <div className="row">
                <div className="col-lg-6 offset-md-3">
                    <ErrorList errors={errors}/>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 offset-lg-4 text-center pt-5">
                    <button onClick={onBack} className="btn btn-white mb-3"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
                    <MovieItem image={selectedMovie.data.thumbnail}/>
                    <h4 className="text-white mt-2 mb-5">{selectedMovie.data.title}</h4>
                    <div className="flex justify-content-center aligns-items-center">
                        <Link to={`/my-movies/${selectedMovie.id}/edit`} className="btn btn-warning btn-sm me-1"><i className="fas fa-edit me-1"></i>Edit movie</Link>
                        <button onClick={onSectionRemoveMovie} className="btn btn-danger btn-sm"><i className="fas fa-trash-alt me-1"></i>Remove from list</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const editSectionLayout = (
        <div className="text-white">
            <div className="row">
                <div className="col-lg-6">
                    { updated && 
                        <div className="alert alert-success"><i className="far fa-check-circle me-1"></i>Data has been updated!</div>
                    }
                    <ErrorList errors={errors}/>
                </div>
            </div>
            <button onClick={onBack} className="btn btn-white mb-3"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
            <div className="row mb-4">
                <div className="col-lg-6">
                    <h3 className="mb-3">Edit Section: <b>{series.title}</b></h3>
                    { id !== 'my-list' &&
                    <form onSubmit={onSubmitUpdate}>
                        <div className="form mb-4">
                            <label className="form-label text-white font-weight-bold" htmlFor="title">Section Title</label>
                            <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-danger pbg-accent"><i className="fas fa-save me-1"></i>Save</button>
                    </form>
                    }
                </div>
            </div>
            <div className="d-flex justify-content-start align-items-center">
                <h4 className="text-white ms-2 me-2">Movies</h4>
                <Link to="/my-movies" className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i className="fas fa-edit me-1"></i>Add Movie</Link>
            </div>
            <MovieList title='Movies' movies={movies} onMovieClick={onMovieClick}/>
            { id !== 'my-list' && (
            <div>
                <h4 className="text-white ms-2 me-2">Others</h4>
                <button onClick={onSectionDelete} className="btn btn-danger"><i className="fas fa-edit me-1"></i>Delete Section</button>
            </div>)
            }
        </div>
    );

    return movieEditMode ? editMovieLayout : editSectionLayout;
}

export default React.memo(EditSection);