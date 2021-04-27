import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import LibrarySection from './../../components/LibrarySection';

import { SeriesToArray } from './../../utils/series';

function Main(props) {
    const history = useHistory();
    const series = useSelector(state => state.series.list);
    const myList = useSelector(state => state.series.myList);

    const seriesArray = SeriesToArray(series);
    
    const editSection = useCallback((id) => {
        history.push(`/library/edit-section/${id}`);
    }, [history]);

    const onMovieClick = useCallback((movieId) => {
        history.push(`/my-movies/${movieId}/edit`)
    }, [history]);

    const renderedSections = seriesArray.map((s) => {
        return <LibrarySection key={s.id} id={s.id} title={s.title} movies={s.movies} onSectionEdit={editSection} onMovieClick={onMovieClick}/>
    })

    return (
        <React.Fragment>
            <LibrarySection id='my-list' title={myList.title} movies={myList.movies} onSectionEdit={editSection} onMovieClick={onMovieClick}/>
            <div onClick={() => history.push("/library/add-section")} className="mx-2 add-section-bg mb-3">
                <span><i className="fas fa-plus-circle me-1"></i>Add section</span>
            </div>
            {renderedSections}
        </React.Fragment>
    );
}

export default React.memo(Main);