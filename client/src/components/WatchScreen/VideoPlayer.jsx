import React from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer(props) {
    return (
        <ReactPlayer 
            width='100%' height='100%' playing={true} muted={true} controls={true}
            url='https://storage.googleapis.com/paimontv/users/bm9pcmVmaWVsZEBnbWFpbC5jb20=/86edfc18-6e13-4f40-a11f-8eab72a25303'
        />
    )
}

export default React.memo(VideoPlayer);