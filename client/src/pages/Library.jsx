import React from 'react';

import Main from './Library/Main';
import AddSection from './Library/AddSection';
import EditSection from './Library/EditSection';

function Library(props) {
    return (
        <div className="container-fluid pt-5 library">
            <Main/>
        </div>
    );
}

export default Library;