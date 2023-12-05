import React from 'react'

import "./progressBar.scss"

export function ProgressBar(props) {
    return (
        <div className='ProgressBar'>
            <div className='outer'/>
            <div className='inner' style={{width: props.value * 100 + "%" }}/>
        </div>
    );
}