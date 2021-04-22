import React from 'react';

function ErrorList(props) {
    if(!props.errors || props.errors.length <= 0) return null;

    return (
        <div className="alert alert-danger mb-2">
            <ul className="mb-0">
            {props.errors.map((e) => {
                return <li>{e.message}</li>
            })}
            </ul>
        </div>
    )
};

export default React.memo(ErrorList);