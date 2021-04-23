import React, { useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { useDispatch, useSelector, useStore } from 'react-redux';

import axios from './../../utils/axios';

import { AppSetLoading } from './../../store/actions/app.action';
import { SeriesSetSingle, SeriesFetch } from './../../store/actions/series.action';

import MovieList from './../../components/MovieList';
import MovieItem from './../../components/MovieItem';
import ErrorList from './../../components/ErrorList';

const section = {
    title: "My List",
    movies: [
        {
            title: "Star Wars: Episode I – The Phantom Menace",
            subTitle: "Star Wars Series",
            image: "https://ae01.alicdn.com/kf/HTB1h5pCNXXXXXXiaXXXq6xXFXXX9.jpg",
            year: "1999"
        },
        {
            title: "Star Wars: Episode II - Attack of the Clones",
            subTitle: "Star Wars Series",
            image: "https://images-na.ssl-images-amazon.com/images/I/61KEdyRT5eL._AC_SL1050_.jpg",
            year: "2002"
        },
        {
            title: "Star Wars: Episode I – The Phantom Menace",
            subTitle: "Star Wars Series",
            image: "https://m.media-amazon.com/images/M/MV5BMWZiYzhlMjgtMDRjMS00MDRhLTgzMjctMzAxYjU2YTBjZjU1XkEyXkFqcGdeQXVyNDQxNjcxNQ@@._V1_.jpg",
            year: "1999"
        }
    ]
};


function EditSection(props) {
    const { id } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const seriesList = useSelector(state => state.series.list);
    const userToken = useSelector(state => state.user.user.token);
    
    const series = seriesList[id];

    const [title, setTitle] = useState(series ? series.title : "");
    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState([]);
    

    if(!series) return <Redirect to="/library"/>


    const onBack = (e) => {
        e.preventDefault();
        history.goBack();
    }

    const onSubmitUpdate = async (e) => {
        e.preventDefault();

        if(title.length <= 0) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            const { data } = await axios.put(`/series/${id}`, { title }, { 
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

        if(title.length <= 0) return;

        const deletionCheck = window.confirm("Are you sure?");
        if(!deletionCheck) return;

        if(title.length <= 0) return;

        setUpdated(false);
        setErrors([]);
        dispatch(AppSetLoading(true));

        try {
            await axios.delete(`/series/${id}`, { 
                headers: { Authorization: `Bearer ${userToken}` }
            })

            //dispatch(AppSetLoading(false));
            dispatch(SeriesFetch(true));
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        }
    }

    const editMovieLayout = (
        <div className="row">
            <div className="col-lg-4 offset-lg-4 text-center pt-5">
                <button type="submit" className="btn btn-white mb-3"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
                <MovieItem image={`https://m.media-amazon.com/images/M/MV5BMWZiYzhlMjgtMDRjMS00MDRhLTgzMjctMzAxYjU2YTBjZjU1XkEyXkFqcGdeQXVyNDQxNjcxNQ@@._V1_.jpg`}/>
                <h4 className="text-white mt-2">Kaguya-sama: Love Is War!</h4>
                <div className="flex justify-content-center aligns-items-center">
                    <button className="btn btn-warning btn-sm me-1"><i className="fas fa-edit me-1"></i>Edit movie</button>
                    <button className="btn btn-danger btn-sm"><i className="fas fa-trash-alt me-1"></i>Remove from list</button>
                </div>
            </div>
        </div>
    );

    const editSectionLayout = (
        <div className="text-white">
            <button onClick={onBack} className="btn btn-white mb-3"><i className="fas fa-arrow-circle-left me-1"></i>Back</button>
            <div className="row mb-4">
                <div className="col-lg-5">
                    { updated && 
                    <div className="alert alert-success"><i className="far fa-check-circle me-1"></i>Data has been updated!</div>
                    }
                    <ErrorList errors={errors}/>
                    <h3 className="mb-3">Edit Section: <b>{series.title}</b></h3>
                    <form onSubmit={onSubmitUpdate}>
                        <div className="form mb-4">
                            <label className="form-label text-white font-weight-bold" htmlFor="title">Section Title</label>
                            <input type="text" id="title" className="form-control border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-danger pbg-accent"><i className="fas fa-save me-1"></i>Save</button>
                    </form>
                </div>
            </div>
            <div className="d-flex justify-content-start align-items-center">
                <h4 className="text-white ms-2 me-2">Movies</h4>
                <button className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i className="fas fa-edit me-1"></i>Add Movie</button>
            </div>
            <MovieList title={section.title} movies={section.movies}/>
            <h4 className="text-white ms-2 me-2">Others</h4>
            <button onClick={onSectionDelete} className="btn btn-danger"><i className="fas fa-edit me-1"></i>Delete Section</button>
        </div>
    );

    return editSectionLayout;
}

export default React.memo(EditSection);