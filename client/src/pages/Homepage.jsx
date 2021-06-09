import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { AppSetLoading } from './../store/actions/app.action';

import axios from './../utils/axios';
import { Debug } from '../utils/logger';

import styles from './Homepage.module.css';
import paimonLetter from './../assets/images/paimon-letter.png';


function Homepage(props) {
    Debug(`[App][MainScreen][Homepage] Render`);

    const dispatch = useDispatch();

    const loaded = useSelector(state => state.home.loaded);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if(loaded) return;

        dispatch(AppSetLoading(true));
        axios.get(`/shared/1`).then(({ data }) => {
           
            dispatch(AppSetLoading(false));
        }).catch((err) => {
            if(err.response) setErrors(err.response.data.errors);
            else setErrors([{ message: 'Paimon không thể kết nối tới máy chủ :(' }]);

            dispatch(AppSetLoading(false));
        });
    // eslint-disable-next-line
    }, []);
    
    if(errors.length > 0) return (
        <div className={styles.paimonContainer}>
            <div>
                <img className={styles.paimonError} src={paimonLetter}/>
                { errors.map((e, i) => <p className={styles.errorText} key={i}>{e.message}</p> )}
            </div>
        </div>
    )

    return (
        <div className="container pt-5 library">
            
        </div>
    );
}

export default React.memo(Homepage);