import React from 'react';
import QueueItem from './../components/QueueItem';

function Queue(props) {

    return (
        <div className="container queue text-white pt-5">
            <h4 className="mb-3">Processing Queue</h4>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <QueueItem/>
                </div>
                <div className="col-md-6 mb-3">
                    <QueueItem/>
                </div>
                <div className="col-md-6 mb-3">
                    <QueueItem/>
                </div>
            </div>
        </div>
    );
}

export default Queue;