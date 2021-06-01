import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AppSetLoading } from '../../store/actions/app.action';
import { SharedReset } from '../../store/actions/shared.action';
import axios from '../../utils/axios';
import { Debug } from '../../utils/logger';

import LibrarySection from './../../components/LibrarySection';
import { SeriesToArray } from './../../utils/series';

function Main(props) {
    const history = useHistory();
    const dispatch = useDispatch();

    const userToken = useSelector(state => state.user.user.token);
    const series = useSelector(state => state.series.list);
    const myList = useSelector(state => state.series.myList);

    const seriesArray = SeriesToArray(series);
    
    const editSection = useCallback((id) => {
        history.push(`/library/edit-section/${id}`);
    }, [history]);

    const onMovieClick = useCallback((movieId) => {
        dispatch(AppSetLoading(true));
        axios.post(`/movies/share/${movieId}`, {}, { 
            headers: { Authorization: `Bearer ${userToken}` }
        }).then(({ data }) => {
            dispatch(AppSetLoading(false));
            history.push(`/shared/${data.sharedId}`);
        }).catch((err) => {
            dispatch(AppSetLoading(false));

            if(err.response) alert(err.response.data.errors[0].message);
        })

        // history.push(`/my-movies/${movieId}/edit`);
    // eslint-disable-next-line
    }, [history]);

    useEffect(() => {
        dispatch(SharedReset());
    // eslint-disable-next-line
    }, []);

    const renderedSections = seriesArray.map((s) => {
        return <LibrarySection key={s.id} id={s.id} title={s.title} movies={s.movies} onSectionEdit={editSection} onMovieClick={onMovieClick}/>
    })

    Debug(`App][MainScreen][Library][Main] Render`);

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