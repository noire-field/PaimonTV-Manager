import React from 'react';

function ErrorList(props) {
    if(!props.errors || props.errors.length <= 0) return null;

    return (
        <div className="alert alert-danger mb-2">
            <p className="mb-0 font-weight-bold">Errors:</p>
            <ul className="mb-0">
            {props.errors.map((e, i) => {
                return <li key={i}>{e.message}</li>
            })}
            </ul>
        </div>
    )
};

export default React.memo(ErrorList);