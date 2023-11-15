import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import VideoJS from './video.jsx'

function Query() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([])
    const [selectedLabels, setSelectedLabels] = React.useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [checked, setChecked] = React.useState([]);
    const [queryMetaItems, setQueryMetaItems] = useState([]);
    const [queryData, setQueryData] = useState([]);
    const [source, setSource] = useState(null);

    const playerRef = useRef(null);

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: source,
            type: 'video/mp4'
        }]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const labels = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

    // get all processed tasks from tasks.json
    // add each task's index as field "key"
    useEffect(() => {
        (async function () {
            const result = await window.electronAPI.getTasks();
            const temp = [];
            for (const key in result) {
                if (key !== "count") {
                    result[key]["key"] = key;

                    if (result[key]["status"] === "processed") {
                        temp.push(result[key]);
                    }
                }
            }

            // newest task displayed first
            temp.sort((a, b) => {
                const date1 = new Date(a);
                const date2 = new Date(b);

                if (date1 > date2) {
                    return 1;
                }

                return -1;
            });

            setTasks(temp);
        })();
    }, [])

    function getTask(key) {
        for (const task of tasks) {
            if (task["key"] == key) {
                return task;
            }
        }
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    useEffect(() => {
        const result = []
        for (const value of checked) {
            result.push(tasks[value]);
        }
        setSelectedTasks(result);
    }, [checked])

    useEffect(() => {
        setQueryMetaItems([]);
        setQueryData([]);
        // send list of tasks and list of labels. tasks must have 'key' on them
        // in return receive list of objects in the 
        // following format:
        // [
        // {key: 0, label1: 5, label2: 10, label3: 0}
        // ]
        // the key (id) for the task and a count for each label
        if (selectedLabels.length > 0 && selectedTasks.length > 0) {
            (async function () {
                const result = await window.electronAPI.getQueryMeta(selectedLabels, selectedTasks);
                setQueryMetaItems(result);
            })();
        }
    }, [selectedLabels, selectedTasks])

    // want to display the video
    // want to get the frames for hyperlinking
    // each frame has a label associated with it
    function handleViewClick(task) {
        (async function () {
            const result = await window.electronAPI.getQueryData(selectedLabels, task);
            setQueryData(result);

            setSource("http://localhost:7654/" + task["source_file_location"]);
        })();
    }

    // TODO: feed in time stamp
    // HOW: in yolo.py use total_frames and frame to calculate timestamp
    // then change getQueryData to return timestamps rather than frames
    // then change the mapping of queryDataItems to use timestamps
    // then change this function to take the timestamp as input and seek to that time
    function handleSeek() {
        playerRef.current.currentTime(10);
        playerRef.current.pause();
    }

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('/')}>Home</Button>

            <Box sx={{ width: 360 }}>
                <Autocomplete
                    multiple
                    id="tags-standard"
                    options={labels}
                    getOptionLabel={(option) => option}
                    onChange={(event, value) => {
                        setSelectedLabels(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Search"
                        />
                    )}
                />
            </Box>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {tasks.map((task) => {
                    const labelId = `checkbox-list-label-${task["key"]}`;

                    return (
                        <ListItem
                            key={task["key"]}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(task["key"])} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(task["key"]) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${task["model_params"]["yolo"]["name"]}`} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {
                queryMetaItems &&
                queryMetaItems.map((metaItem) => {
                    const renderList = []
                    const task = getTask(metaItem["key"]);
                    for (const [key, value] of Object.entries(metaItem)) {
                        renderList.push({ "key": key, "value": value });
                    }

                    return (
                        <div key={metaItem["key"]}>
                            <Typography>{task["model_params"]["yolo"]["name"]}</Typography>
                            {
                                renderList &&
                                renderList.map((item) => {
                                    return (<Typography key={item["key"]}>{item["key"]} {item["value"]}</Typography>)
                                })
                            }
                            <Button onClick={() => handleViewClick(task)}>View</Button>
                        </div>
                    )
                })
            }

            {
                queryData &&
                queryData.map((queryDataItem) => {
                    for (const [label, data] of Object.entries(queryDataItem)) {
                        const frames = data["frames"]
                        const counts = data["counts"]
                        return (
                            <div key={label}>
                                <Typography>{label}</Typography>
                                {
                                    frames.map((frame, index) => {
                                        return (<Button onClick={() => handleSeek()} key={label + frame}>{frame} {counts[index]}</Button>)
                                    })
                                }
                            </div>
                        )
                    }
                })
            }
            {
                source &&
                <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            }
        </div>
    )
}

export default Query