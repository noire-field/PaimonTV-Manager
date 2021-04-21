import React from 'react';

import MovieList from './../../components/MovieList';
import MovieItem from './../../components/MovieItem';

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
    const editMovieLayout = (
        <div className="row">
            <div className="col-lg-4 offset-lg-4 text-center pt-5">
                <button type="submit" className="btn btn-white mb-3"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
                <MovieItem image={`https://m.media-amazon.com/images/M/MV5BMWZiYzhlMjgtMDRjMS00MDRhLTgzMjctMzAxYjU2YTBjZjU1XkEyXkFqcGdeQXVyNDQxNjcxNQ@@._V1_.jpg`}/>
                <h4 className="text-white mt-2">Kaguya-sama: Love Is War!</h4>
                <div className="flex justify-content-center aligns-items-center">
                    <button className="btn btn-warning btn-sm me-1"><i class="fas fa-edit me-1"></i>Edit movie</button>
                    <button className="btn btn-danger btn-sm"><i class="fas fa-trash-alt me-1"></i>Remove from list</button>
                </div>
            </div>
        </div>
    );

    const editSectionLayout = (
        <div className="text-white">
            <button type="submit" className="btn btn-white mb-3"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
            <div className="row mb-4">
                <div className="col-lg-5">
                    <h3 className="mb-3">Edit Section: <b>Saigon In My Heart</b></h3>
                    <form>
                        <div className="form mb-4">
                            <label className="form-label text-white font-weight-bold" for="auth-email">Section Title</label>
                            <input type="email" id="auth-email" className="form-control border" />
                        </div>
                        <button type="submit" className="btn btn-danger pbg-accent"><i class="fas fa-save me-1"></i>Save</button>
                    </form>
                </div>
            </div>
            <div className="d-flex justify-content-start align-items-center">
                <h4 className="text-white ms-2 me-2">Movies</h4>
                <button className="btn btn-danger pbg-accent btn-sm px-2 py-1"><i class="fas fa-edit me-1"></i>Add Movie</button>
            </div>
            <MovieList title={section.title} movies={section.movies}/>
            <h4 className="text-white ms-2 me-2">Others</h4>
            <button className="btn btn-danger"><i class="fas fa-edit me-1"></i>Delete Section</button>
        </div>
    );

    return editSectionLayout;
}

export default EditSection;