import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Yolo from './yolo.jsx';

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
    const [showYoloParams, setShowYoloParams] = useState(true);
    const [sourceFileLocation, setSourceFileLocation] = useState('');
    const [sourceFileName, setSourceFileName] = useState('');

    const modelParametersRef = useRef({ "yolo": {} });

    async function handleFileUpload() {
        const { fpath, fname } = await window.electronAPI.openFile();
        if (fpath && fname) {
            modelParametersRef.current["yolo"]["source"] = fpath
            setSourceFileLocation(fpath);
            setSourceFileName(fname);
        }
    }

    function handleNameChange(event) {
        modelParametersRef.current["yolo"]["name"] = event.target.value;
        setName(event.target.value);
    }

    async function handleCreateTask() {
        const models = []
        if (showYoloParams) models.push("yolo");

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

    return (
        <div>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} onClick={() => handleFileUpload()}>
                Upload Video
            </Button>
            <TextField id="task-name" label="Task name" variant="standard" onChange={(e) => handleNameChange(e)} />
            <Typography>Model Selection</Typography>
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onClick={() => setShowYoloParams((prev) => !prev)} />} label="Yolo" />
            </FormGroup>
            {showYoloParams && <Yolo modelParametersRef={modelParametersRef} />}
            <Button variant="contained" onClick={() => navigate('/')}>Home</Button>
            <Button variant="contained" onClick={() => handleCreateTask()}>Create Task</Button>
        </div>
    )
}

export default Upload