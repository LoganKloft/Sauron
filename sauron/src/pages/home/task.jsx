import React from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Task({ task }) {

    function handleProcessTask() {

    }

    return (
        <div>
            <Typography>{task["model_params"]["yolo"]["name"]}</Typography>
            <Typography>{task["status"]}</Typography>
            <Typography>{task["create_date"]}</Typography>
            <Typography>{task["source_file_name"]}</Typography>
            <Typography>{task["source_file_location"]}</Typography>
            <Typography>{task["models"]}</Typography>
            <Button onClick={() => handleProcessTask}>Process</Button>
        </div>
    )
}

export default Task