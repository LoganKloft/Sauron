import React, { useEffect, useState } from 'react'

import './options.scss'

function MobileNetSSD({ modelParametersRef }) {
    const DefaultConfidence = 70;
    const DefaultStride = 10;
    const [confidence, setConfidence] = useState(DefaultConfidence);
    const [stride, setStride] = useState(DefaultStride);

    useEffect(() => {
        modelParametersRef.current["mobilenetssd"]["conf"] = DefaultConfidence / 100;
        modelParametersRef.current["mobilenetssd"]["vid_stride"] = DefaultStride;
    }, [])

    function handleConfidenceChange(event, newValue) {
        const value = event.target.value;
        modelParametersRef.current["mobilenetssd"]["conf"] = value / 100;
        setConfidence(value);
    }

    function handleStrideChange(event) {
        const val = Number(event.target.value);
        modelParametersRef.current["mobilenetssd"]["vid_stride"] = val;
        setStride(val);
    }

    return (
        <div className='optionsContainer'>
            <label>
                <span>Confidence</span>
                <input type="range" min="0" max="100" defaultValue={confidence} onChange={handleConfidenceChange}/>
            </label>

            <label>
                <span>Stride</span>
                <input type="number" min="1" max="100" defaultValue={stride} onChange={handleStrideChange}/>
            </label>
        </div>
    )
}

export default MobileNetSSD