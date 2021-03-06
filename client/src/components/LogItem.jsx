import React from 'react';

function LogItem(props) {
    const { message, reference, url, createdAt } = props.log;

    return (
        <div className="card text-dark mb-2">
            <div className="card-body">
                <div>
                    <h5 className="card-title mb-2">{reference}</h5>
                    <p className="card-text m-0 p-0">Time: <b>{new Date(createdAt).toLocaleString()}</b> - Message: <b>{message}</b></p>
                    <p className="card-text m-0 p-0 link-wrap">URL: <b>{url}</b></p>
                </div>
            </div>
        </div>
    )
}

export default React.memo(LogItem);