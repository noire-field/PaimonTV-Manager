import React from 'react';
import paimonLetter from './../assets/images/paimon-letter.png';

function Login(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 pt-5">
                    <div className="card border">
                        <div className="card-header text-center font-weight-bold"><i className="fas fa-house-user"></i> Paimon Gatekeeper</div>
                        <div className="card-body py-4">
                            <div className="row">
                                <div className="col-lg-5 text-center">
                                    <img src={paimonLetter} alt="Paimon Gatekeeper" className="img-fluid paimon-auth-img mb-2"/>
                                </div>
                                <div className="col-lg-7">
                                    <form>
                                        <div className="form-outline mb-4">
                                            <input type="email" id="auth-email" className="form-control border" />
                                            <label className="form-label" for="auth-email">Email address</label>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input type="password" id="auth-password" className="form-control border" />
                                            <label className="form-label" for="auth-password">Password</label>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-lg-6 d-flex justify-content-center align-items-center">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="auth-remember" checked disabled/>
                                                <label className="form-check-label" for="auth-remember">Remember me</label>
                                            </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <a href="#" className="text-muted">Forgot password?</a>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                    </form>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;