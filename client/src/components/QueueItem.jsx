import React from 'react';

function QueueItem(props) {
    const { movieId, episodeId, movieTitle, episodeTitle, fileSize, status, progress } = props.item;
    
    var statusText;

    switch(status) {
        case 0: statusText = 'Waiting'; break;
        case 1: statusText = `Downloading ${progress || 0}%`; break;
        case 2: statusText = `Uploading ${progress || 0}%`; break;
        case 3: statusText = 'Completed'; break;
        case 4: statusText = 'Failed'; break;
        default: statusText = 'Unknown'; break;
    }

    return (
        <div className="card text-dark mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-0">#{props.orderId + 1}. {movieTitle || movieId.substr(0, movieId.length / 2)+"***" } - {episodeTitle || episodeId}</h5>
                    <p className="card-text">File Size: <b>{ fileSize > 0 ? Math.round(fileSize / 1048576) : '?' }MB</b> </p>
                </div>
                <div className="text-end">
                    <span className="d-block small font-weight-bold">Processing: {status}/3</span>
                    <span className="badge bg-success"><b>{statusText}</b></span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(QueueItem);