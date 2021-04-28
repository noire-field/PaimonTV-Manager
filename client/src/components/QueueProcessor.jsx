import React from 'react';

function QueueProcessor(props) {
    const { id, status } = props.item;

    return (
        <div className="card text-dark mb-2">
            <div className="card-body px-3 py-2">
                <h5 className="card-title mb-0">Processor #{id}</h5>
                <p className="card-text">Status: <b>{status}</b> </p>
            </div>
        </div>
    )
}

export default React.memo(QueueProcessor);