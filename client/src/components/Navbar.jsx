import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';

import { AppSetState } from './../store/actions/app.action';
import { UserSignOut } from './../store/actions/user.action';

function Navbar(props) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);

    const onSignOut = (e) => {
        e.preventDefault();

        dispatch(UserSignOut());
        dispatch(AppSetState(0));
        Cookies.remove('JWT');
    }

    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light border shadow">
            <div className="container-fluid">
                <span className="navbar-brand">
                    <span className="me-1">PaimonTV</span>
                    <span className="font-weight-bold badge bg-dark text-light p-1">Dashboard</span>
                </span>
                <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbar-main" aria-controls="navbar-main" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbar-main">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/home" className="nav-link" activeClassName="nav-link active"><i className="fas fa-home me-1"></i>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/library" className="nav-link" activeClassName="nav-link active"><i className="fa fa-list me-1"></i>Library</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/my-movies" className="nav-link" activeClassName="nav-link active"><i className="fas fa-film me-1"></i>Movies</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/queue" className="nav-link" activeClassName="nav-link active"><i className="fas fa-cog me-1"></i>Queue</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/logs" className="nav-link" activeClassName="nav-link active"><i className="fas fa-info-circle me-1"></i>Logs</NavLink>
                        </li>
                        {/*
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                            Dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                <a className="dropdown-item" href="#">Something else here</a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true"
                            >Disabled</a>
                        </li>
                        */} 
                    </ul>

                    <ul className="navbar-nav flex-row">
                        <li className="nav-item dropdown me-3 me-lg-1">
                            <span className="nav-link d-sm-flex align-items-sm-center dropdown-toggle hidden-arrow"
                                id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                                <img
                                    src="https://mdbootstrap.com/img/new/avatars/1.jpg"
                                    className="rounded-circle"
                                    height="22"
                                    alt=""
                                    loading="lazy"
                                />
                                <strong className="d-inline-block d-sm-block ms-1 me-1">{user.email}</strong>
                            </span>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                <li><span className="dropdown-item" onClick={onSignOut}>Logout</span></li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default React.memo(Navbar);