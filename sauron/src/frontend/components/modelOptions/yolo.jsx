import React, { useEffect, useState } from 'react'

import './options.scss'

function Yolo({ modelParametersRef }) {
    const weightOptions = ["YOLOv8n", "YOLOv8s", "YOLOv8m", "YOLOv8l", "YOLOv8x"];

    const DefaultConfidence = 70;
    const DefaultStream = true;
    const DefaultSave = true;
    const DefaultWeight = "YOLOv8n";
    const DefaultStride = 10;
    const DefaultProject = "./src/data/video";

    const [confidence, setConfidence] = useState(DefaultConfidence);
    const [stream, setStream] = useState(DefaultStream);
    const [save, setSave] = useState(DefaultSave);
    const [weight, setWeight] = useState(DefaultWeight);
    const [stride, setStride] = useState(DefaultStride);

    useEffect(() => {
        modelParametersRef.current["yolo"]["conf"] = DefaultConfidence / 100;
        modelParametersRef.current["yolo"]["stream"] = DefaultStream;
        modelParametersRef.current["yolo"]["save"] = DefaultSave;
        modelParametersRef.current["yolo"]["weights"] = DefaultWeight;
        modelParametersRef.current["yolo"]["vid_stride"] = DefaultStride;
        modelParametersRef.current["yolo"]["project"] = DefaultProject;
    }, [])

    function handleConfidenceChange(event) {
        const value = event.target.value;
        modelParametersRef.current["yolo"]["conf"] = value / 100;
        setConfidence(value);
    }

    function handleStreamChange() {
        modelParametersRef.current["yolo"]["stream"] = !stream;
        setStream((prev) => !prev)
    }

    function handleSaveChange() {
        modelParametersRef.current["yolo"]["save"] = !save;
        setSave((prev) => !prev)
    }

    function handleWeightChange(event) {
        modelParametersRef.current["yolo"]["weights"] = event.target.value;
        setWeight(event.target.value);
    }

    function handleStrideChange(event) {
        const val = Number(event.target.value);
        modelParametersRef.current["yolo"]["vid_stride"] = val;
        setStride(val);
    }

    return (
        <div className='optionsContainer'>
            <label>
                <span>Confidence</span>
                <input type="range" min="0" max="100" defaultValue={confidence} onChange={handleConfidenceChange}/>
            </label>

            <label>
                <span>Stream</span>
                <input type="checkbox" checked={stream} onChange={handleStreamChange}/>
            </label>

            <label>
                <span>Save</span>
                <input type="checkbox" checked={save} onChange={handleSaveChange}/>
            </label>

            <label>
                <span>Weights</span>
                <select defaultValue={weight} onChange={handleWeightChange}>
                    { weightOptions.map((option) => {
                        return  <option key={option} value={option}>{option}</option>
                    })}
                </select>
            </label>

            <label>
                <span>Stride</span>
                <input type="number" min="1" max="100" defaultValue={stride} onChange={handleStrideChange}/>
            </label>
        </div>
    )
}

export default Yolo