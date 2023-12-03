import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Yolo from './yolo.jsx';
import EfficientDetD0 from './efficientdet_d0.jsx';
import MobileNetSSD from './mobilenetssd.jsx';
import FasterRCNN from './faster_rcnn.jsx';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function Upload() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [showYoloParams, setShowYoloParams] = useState(false);
    const [showMobilenetSSDParams, setShowMobilenetSSDParams] = useState(false);
    const [showFasterRCNNParams, setShowFasterRCNNParams] = useState(false);
    const [showEfficientDetD0Params, setShowEfficientDetD0Params] = useState(false);
    const [sourceFileLocation, setSourceFileLocation] = useState('');
    const [sourceFileName, setSourceFileName] = useState('');

    const modelParametersRef = useRef({ "yolo": {}, "mobilenetssd": {}, "faster_rcnn": {}, "efficientdet_d0": {} });

    async function handleFileUpload() {
        const { fpath, fname } = await window.electronAPI.openFile();
        if (fpath && fname) {
            modelParametersRef.current["yolo"]["source"] = fpath;
            modelParametersRef.current["mobilenetssd"]["source"] = fpath;
            modelParametersRef.current["faster_rcnn"]["source"] = fpath;
            modelParametersRef.current["efficientdet_d0"]["source"] = fpath;
            setSourceFileLocation(fpath);
            setSourceFileName(fname);
        }
    }

    function handleNameChange(event) {
        modelParametersRef.current["yolo"]["name"] = event.target.value;
        modelParametersRef.current["mobilenetssd"]["name"] = event.target.value;
        modelParametersRef.current["faster_rcnn"]["name"] = event.target.value;
        modelParametersRef.current["efficientdet_d0"]["name"] = event.target.value;
        setName(event.target.value);
    }

    async function handleCreateTask() {
        let models = []
        if (showYoloParams) {
            models = ["yolo"];

            // divide confidence by 100
            modelParametersRef.current["yolo"]["conf"] = modelParametersRef.current["yolo"]["conf"] / 100;
        }

        if (showMobilenetSSDParams) {
            models = ["mobilenetssd"];

            // divide confidence by 100
            modelParametersRef.current["mobilenetssd"]["conf"] = modelParametersRef.current["mobilenetssd"]["conf"] / 100;
        }

        if (showFasterRCNNParams) {
            models = ["faster_rcnn"];

            // divide confidence by 100
            modelParametersRef.current["faster_rcnn"]["conf"] = modelParametersRef.current["faster_rcnn"]["conf"] / 100;
        }

        if (showEfficientDetD0Params) {
            models = ["efficientdet_d0"];

            // divide confidence by 100
            modelParametersRef.current["efficientdet_d0"]["conf"] = modelParametersRef.current["efficientdet_d0"]["conf"] / 100;
        }

        const task = {}

        task["source_file_location"] = sourceFileLocation;
        task["source_file_name"] = sourceFileName;
        task["create_date"] = (new Date()).toUTCString();
        task["models"] = models;
        task["status"] = "unprocessed";
        task["model_params"] = modelParametersRef.current;

        await window.electronAPI.saveTask(task);

        navigate('/');
    }

    function handleModelSelection(value) {
        if (value == "yolo") {
            setShowYoloParams(true);
            setShowMobilenetSSDParams(false);
            setShowFasterRCNNParams(false);
            setShowEfficientDetD0Params(false);
        }
        else if (value == "mobilenetssd") {
            setShowYoloParams(false);
            setShowMobilenetSSDParams(true);
            setShowFasterRCNNParams(false);
            setShowEfficientDetD0Params(false);
        }
        else if (value == "faster_rcnn") {
            setShowYoloParams(false);
            setShowMobilenetSSDParams(false);
            setShowFasterRCNNParams(true);
            setShowEfficientDetD0Params(false);
        }
        else if (value == "efficientdet_d0") {
            setShowYoloParams(false);
            setShowMobilenetSSDParams(false);
            setShowFasterRCNNParams(false);
            setShowEfficientDetD0Params(true);
        }
    }

    return (
        <div>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} onClick={() => handleFileUpload()}>
                Upload Video
            </Button>
            <TextField id="task-name" label="Task name" variant="standard" onChange={(e) => handleNameChange(e)} />
            <FormControl>
                <FormLabel id="model-selection-group">Model Selection</FormLabel>
                <RadioGroup
                    aria-labelledby="model-selection-group"
                    name="model-selection"
                    onChange={(e) => handleModelSelection(e.target.value)}
                >
                    <FormControlLabel value="yolo" control={<Radio />} label="yolo" />
                    <FormControlLabel value="mobilenetssd" control={<Radio />} label="mobilenetssd" />
                    <FormControlLabel value="faster_rcnn" control={<Radio />} label="faster_rcnn" />
                    <FormControlLabel value="efficientdet_d0" control={<Radio />} label="efficientdet_d0" />
                </RadioGroup>
            </FormControl>
            {showYoloParams && <Yolo modelParametersRef={modelParametersRef} />}
            {showMobilenetSSDParams && <MobileNetSSD modelParametersRef={modelParametersRef} />}
            {showFasterRCNNParams && <FasterRCNN modelParametersRef={modelParametersRef} />}
            {showEfficientDetD0Params && <EfficientDetD0 modelParametersRef={modelParametersRef} />}
            <Button variant="contained" onClick={() => navigate('/')}>Home</Button>
            <Button variant="contained" onClick={() => handleCreateTask()}>Create Task</Button>
        </div>
    )
}

export default Upload