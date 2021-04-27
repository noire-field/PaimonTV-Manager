import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import axois from '../utils/axios';
import ErrorList from '../components/ErrorList';
import paimonLetter from './../assets/images/paimon-letter.png';

import { AppSetLoading } from './../store/actions/app.action';
import { UserSignIn, UserFetchData } from './../store/actions/user.action';


function LoginScreen(props) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if(!email || !password)
            return;

        dispatch(AppSetLoading(true));
        setErrors([]);

        try {
            const { data } = await axois.post('/auth/sign-in', { email, password });

            dispatch(AppSetLoading(false));
            dispatch(UserSignIn(data.user.id, data.user.email, data.user.token));
            dispatch(UserFetchData(true));
            
            Cookies.set('JWT', data.user.token, {
                sameSite: 'Strict'
            });
        } catch(err) {
            dispatch(AppSetLoading(false));
            setErrors(err.response.data.errors);
        } 
    }

    console.log(`[App][LoginScreen] Render`);

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 pt-5">
                    <div className="card border mb-2">
                        <div className="card-header text-center font-weight-bold"><i className="fas fa-house-user me-1"></i>Paimon Gatekeeper</div>
                        <div className="card-body py-4">
                            <div className="row">
                                <div className="col-lg-5 text-center">
                                    <img src={paimonLetter} alt="Paimon Gatekeeper" className="img-fluid paimon-auth-img mb-2"/>
                                </div>
                                <div className="col-lg-7">
                                    <form onSubmit={onFormSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label font-weight-bold mb-1" htmlFor="auth-email">Email address</label>
                                            <input type="email" id="auth-email" className="form-control border" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label font-weight-bold mb-1" htmlFor="auth-password">Password</label>
                                            <input type="password" id="auth-password" className="form-control border" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6 d-flex justify-content-center align-items-center">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="auth-remember" checked disabled/>
                                                <label className="form-check-label" htmlFor="auth-remember">Remember me</label>
                                            </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <span className="text-muted">Forgot password?</span>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ErrorList errors={errors}/>
                </div>
            </div>
        </div>
    )
}

export default React.memo(LoginScreen);