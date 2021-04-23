import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import LibrarySection from './../../components/LibrarySection';
import { SeriesFetch } from './../../store/actions/series.action';

import { SeriesToArray } from './../../utils/series';

var myList = {
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

const sections = [
    {
        title: "Starwars Series",
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
                image: "https://images-na.ssl-images-amazon.com/images/I/A1wnJQFI82L._AC_SY879_.jpg",
                year: "1999"
            },
            {
                title: "Star Wars: Episode II - Attack of the Clones",
                subTitle: "Star Wars Series",
                image: "https://www.arthipo.com/image/cache/catalog/poster/movie/1-758/pfilm252-star-wars-episode-v-the-empire-strikes-back-yildiz-savaslari-poster-movie-film-1000x1000.jpg",
                year: "2002"
            },
            {
                title: "Star Wars: Episode I – The Phantom Menace",
                subTitle: "Star Wars Series",
                image: "https://images-na.ssl-images-amazon.com/images/I/71rZtELyYzL._AC_SY679_.jpg",
                year: "1999"
            },
            {
                title: "Star Wars: Episode II - Attack of the Clones",
                subTitle: "Star Wars Series",
                image: "https://images-na.ssl-images-amazon.com/images/I/71fmG3CR%2BvL._AC_SL1112_.jpg",
                year: "2002"
            },
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
                image: "https://ae01.alicdn.com/kf/HTB1h5pCNXXXXXXiaXXXq6xXFXXX9.jpg",
                year: "1999"
            },
            {
                title: "Star Wars: Episode II - Attack of the Clones",
                subTitle: "Star Wars Series",
                image: "https://images-na.ssl-images-amazon.com/images/I/61KEdyRT5eL._AC_SL1050_.jpg",
                year: "2002"
            }
        ]
    },
    {
        title: "Starwars Series",
        movies: [
            {
                title: "Star Wars: Episode I – The Phantom Menace",
                subTitle: "Star Wars Series",
                image: "https://m.media-amazon.com/images/M/MV5BMWZiYzhlMjgtMDRjMS00MDRhLTgzMjctMzAxYjU2YTBjZjU1XkEyXkFqcGdeQXVyNDQxNjcxNQ@@._V1_.jpg",
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
                image: "https://ae01.alicdn.com/kf/HTB1h5pCNXXXXXXiaXXXq6xXFXXX9.jpg",
                year: "1999"
            },
            {
                title: "Star Wars: Episode II - Attack of the Clones",
                subTitle: "Star Wars Series",
                image: "https://images-na.ssl-images-amazon.com/images/I/61KEdyRT5eL._AC_SL1050_.jpg",
                year: "2002"
            }
        ]
    },
];

function Main(props) {
    const dispatch = useDispatch();
    const history = useHistory();

    const series = useSelector(state => state.series.list);

    useEffect(() => {
        dispatch(SeriesFetch());
    }, []);

    const seriesArray = SeriesToArray(series);
    
    const editSection = useCallback((id) => {
        history.push(`/library/edit-section/${id}`);
    });

    const renderedSections = seriesArray.map((s) => {
        return <LibrarySection key={s.id} id={s.id} title={s.title} movies={s.movies} onSectionEdit={editSection}/>
    })

    return (
        <React.Fragment>
            <LibrarySection title={myList.title} movies={myList.movies}/>
            <div onClick={() => history.push("/library/add-section")} className="mx-2 add-section-bg mb-3">
                <span><i className="fas fa-plus-circle me-1"></i>Add section</span>
            </div>
            {renderedSections}
        </React.Fragment>
    );
}

export default Main;