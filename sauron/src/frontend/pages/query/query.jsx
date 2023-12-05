import React, { useState, useEffect, useRef } from 'react'
import VideoJS from '../../components/video/video.jsx';
import { getModelParams } from '../../task_helper.js';

import RightArrowImg from '../../../assets/app/dropdown_right.png'
import LeftArrowImg from '../../../assets/app/dropdown_left.png'

import './query.scss'

function Query() {
    const [showTaskList, setShowTaskList] = useState(true);
    const [showLabelList, setShowLabelList] = useState(true);
    const [tasks, setTasks] = useState([])
    const [currentTask, setCurrentTask] = useState({})
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [checked, setChecked] = useState([]);
    const [queryMetaItems, setQueryMetaItems] = useState([]);
    const [queryData, setQueryData] = useState([]);
    const [source, setSource] = useState(null);
    const playerRef = useRef(null);

    /**
     * Sets the options for initializing the video player
     */
    const videoJsOptions = {
        autoplay: false,
        controls: true,
        controlBar: {
            fullscreenToggle: false,
            pictureInPictureToggle: false
        },
        responsive: true,
        fluid: true,
        sources: [{
            src: source,
            type: 'video/mp4'
        }]
    };

    /**
     * Setups up the player reference to be access in this file.
     * @param {Player} player 
     */
    const handlePlayerReady = (player) => {
        playerRef.current = player;
    };

    /**
     * All the available labels
     */
    const labels = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

    useEffect(() => {
        (async function () {
            // Gets the task list from electron
            const result = await window.electronAPI.getTasks();

            // Store all the entries from tasks that are processed except for the one labeled "count"
            const temp = [];
            for (const key in result) {
                if (key !== "count") {
                    result[key]["key"] = key;

                    if (result[key]["status"] === "processed") {
                        temp.push(result[key]);
                    }
                }
            }

            // sort the task to display the newest first
            temp.sort((a, b) => {
                return new Date(a.create_date) < new Date(b.create_date) ? 1 : -1;
            });

            setTasks(temp);
        })();
    }, [])

    /**
     * Gets the task by key name
     * @param {string} key 
     * @returns {any} task
     */
    function getTask(key) {
        for (const task of tasks) {
            if (task["key"] == key) {
                return task;
            }
        }
    }

    /**
     * Toggles the task on the task list
     * @param {string} value 
     */
    const handleToggleTask = (value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        setSource('');
    };

    /**
     * Toggles the label on the label list
     * @param {string} value 
     */
    const handleToggleLabel = (value) => {
        const currentIndex = selectedLabels.indexOf(value);
        const newLabels = [...selectedLabels];

        if (currentIndex === -1) {
            newLabels.push(value);
        } else {
            newLabels.splice(currentIndex, 1);
        }

        setSelectedLabels(newLabels);
    };

    /**
     * Update the selected tasks whenever a task is selected or unselected
     */ 
    useEffect(() => {
        const result = []
        for (const value of checked) {
            for (const task of tasks) {
                if (value == task["key"]) {
                    result.push(task);
                    break;
                }
            }
        }
        setSelectedTasks(result);
    }, [checked])

    /**
     * Gets the query data anytime the selected labels or selected tasks change
     */ 
    useEffect(() => {
        setQueryMetaItems([]);
        setQueryData([]);

        if (selectedLabels.length > 0 && selectedTasks.length > 0) {
            (async function () {
                const result = await window.electronAPI.getQueryMeta(selectedLabels, selectedTasks);
                setQueryMetaItems(result);
            })();
        }
    }, [selectedLabels, selectedTasks])

    /**
     * Sets up the video player and the query data to correctly display options
     * @param {any} task 
     */

    function handleViewClick(task) {
        (async function () {
            const result = await window.electronAPI.getQueryData(selectedLabels, task);
            setQueryData(result);
            setCurrentTask(task);

            setSource("http://localhost:7654/" + task["source_file_location"]);
        })();
    }

    /**
     * Used to set the video to a specific time
     * @param {string | number} timestamp 
     */
    function handleSeek(timestamp) {
        /** @type {Player} */
        const player = playerRef.current;

        playerRef.current.currentTime(timestamp);
        playerRef.current.pause();
    }

    /**
     * Using the task and query data, create a list of timestamps for each query label
     */
    function getTimestamps()  {        
        const params = getModelParams(currentTask);
        const stride = params.vid_stride;

        return queryData.map((queryDataItem) => {                
            for (const [label, data] of Object.entries(queryDataItem)) {

                // Group each timestamp collection by stride
                const groups = []
                let lastframe = null, currentGroup = null;
                for (let i = 0; i < data.frames.length; i++) {
                    const frame =  data.frames[i];
                    if (lastframe === frame - stride) {
                        currentGroup.push(i);
                    } else {
                        if (currentGroup) groups.push(currentGroup);
                        currentGroup = [i];
                    }
                    lastframe = frame;
                }
                groups.push(currentGroup);

                // Get the first and last timestamp from each group
                const indexedGroups = groups.map((group) => {
                    return {start: data.timestamps[group[0]], end: data.timestamps[group[group.length-1]]}
                })

                return (
                    <div className='timestampGroup'>
                        <span className='timestampLabel'>{label}</span>
                    { indexedGroups.map(group => {
                        return (
                        <>  
                            <div className='timestamp' onClick={() => handleSeek(group.start)}>
                                <span className='label'>Time</span>
                                <span className='time'>{group.start}s - {group.end}s</span>
                            </div>
                        </>
                        )})
                    }
                    </div>
                )
            }
        })
    }

    return (
        <div className='queryContainer'>
            { showTaskList 
            ?    <div className='taskListContainer'>
                    <div className='arrow' onClick={() => setShowTaskList(false)}>
                        <img src={LeftArrowImg}/>
                    </div>
                    <span className='title'>Tasks</span>

                    <hr className='dark'/>

                    <div className='taskList'>
                        {tasks.map((task) => {
                            return (
                            <label key={task['key']} className='task'>
                                <input type="checkbox" checked={checked.indexOf(task["key"]) !== -1} onChange={() => handleToggleTask(task["key"])} />
                                <span>{getModelParams(task)["name"]}</span>
                            </label>
                            )
                        })}
                    </div>
                </div>
            :   <div className='taskListContainer hidden'>
                    <div className='arrow' onClick={() => setShowTaskList(true)}>
                        <img src={RightArrowImg}/>
                    </div>
                </div>
            }

            <div className='videoContainer'>
                <div className='videoPlayer'>
                { source && <VideoJS options={videoJsOptions} onReady={handlePlayerReady} queryData={queryData} />}
                </div>

                <div className='videoInformation'>


                    <div className='taskSelectorContainer'>
                        <table className='table'>
                            <colgroup>
                                <col className="col1"/>
                                <col className="col2"/>
                                <col className="col3"/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Contains</th>
                                </tr>
                            </thead>

                            <tbody>
                            {
                                queryMetaItems &&
                                queryMetaItems.map((metaItem) => {
                                    const task = getTask(metaItem["key"]);
                                    const contains = [];

                                    for (const [key, value] of Object.entries(metaItem)) {
                                        if (key != "key" && value > 0) {
                                            contains.push(key);
                                        }
                                    }

                                    if (contains.length) {
                                        return (
                                            <tr  key={metaItem["key"]}>
                                                <td>
                                                    <button className='view' onClick={() => handleViewClick(task)}>View</button>
                                                </td>
                                                <td className='name'>
                                                    <span>{getModelParams(task)["name"]}</span>
                                                </td>
                                                <td className='contains'>
                                                { contains.map((item) => {
                                                    return (<span className='item'>{item}</span>) 
                                                    })
                                                }
                                                </td>
                                            </tr>
                                        )
                                    }
                                })
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="vl"></div>

                    <div className='timestampContainer'>
                        { queryData.length > 0 && getTimestamps()}
                    </div>
                </div>
            </div>

            { showLabelList 
            ?    <div className='labelListContainer'>
                    <div className='arrow' onClick={() => setShowLabelList(false)}>
                        <img src={RightArrowImg}/>
                    </div>
                    <span className='title'>Labels</span>

                    <hr className='dark'/>

                    <div className='labelList'>
                        {labels.map((label) => {
                            return (
                            <label key={label} className='label'>
                                <input type="checkbox" checked={selectedLabels.indexOf(label) !== -1} onChange={() => handleToggleLabel(label)} />
                                <span>{label}</span>
                            </label>
                            )
                        })}
                    </div>
                </div>
            :   <div className='labelListContainer hidden'>
                    <div className='arrow' onClick={() => setShowLabelList(true)}>
                        <img src={LeftArrowImg}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default Query