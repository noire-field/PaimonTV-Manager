import React from 'react';

function QueueItem(props) {
    return (
        <div className="card text-dark mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-0">#1. Saigon In My Heart - Episode #1</h5>
                    <p className="card-text">File Size: <b>200MB</b> </p>
                </div>
                <div className="text-end">
                    <span className="d-block small font-weight-bold">Processing: 2/2</span>
                    <span className="badge bg-success"><b>Uploading 27%</b></span>
                </div>
            </div>
        </div>
    )
}

export default QueueItem;