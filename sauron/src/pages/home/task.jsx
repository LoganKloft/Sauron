import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { getModelParams } from '../task_helper.js';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={props.value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{props.value}</Typography>
            </Box>
        </Box>
    );
}

function Task({ task }) {

    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);

    function handleProcessTask() {
        window.electronAPI.processTask(task, task["key"]);
    }

    window.electronAPI.handleProgress((event, value, id) => {
        if (value === "start" && id === task["key"]) {
            setShowProgress(true);
        } else if (value === "stop" && id === task["key"]) {
            setShowProgress(false);
        } else if (id === task["key"]) {
            setProgress(Number(value));
        }
    })

    return (
        <div>
            <Typography>{getModelParams(task)["name"]}</Typography>
            <Typography>{task["status"]}</Typography>
            <Typography>{task["create_date"]}</Typography>
            <Typography>{task["source_file_name"]}</Typography>
            <Typography>{task["source_file_location"]}</Typography>
            <Typography>{task["models"]}</Typography>
            {
                task["status"] === "unprocessed" &&
                <Button onClick={() => handleProcessTask()}>Process</Button>
            }
            {
                showProgress &&
                <LinearProgressWithLabel value={progress} />
            }
        </div>
    )
}

export default Task