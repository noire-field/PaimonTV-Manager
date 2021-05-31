import React from 'react';

function Loading(props) {
    return (
        <div className="loading-screen">
            <div className="h-100 wrapper">
                <div className="info-zone d-flex text-white justify-content-center align-items-center">
                    <div className="loading-icon-wrapper">
                        <i className="fas fa-heart icon-front"></i>
                        <i className="fas fa-heart icon-back"></i>   
                    </div>
                    <p className="m-0">Submitting feedback to Paimon Network...</p>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Loading);