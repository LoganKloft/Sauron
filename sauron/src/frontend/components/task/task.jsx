import React, { useEffect, useState } from 'react'
import { getModelParams } from '../../task_helper.js';

import { ProgressBar } from '../progressBar/progressBar.jsx';


import dropdownDown from '../../../assets/app/dropdown_down.png'
import dropdownUp from '../../../assets/app/dropdown_up.png'

import './task.scss'

export function Task({ task }) {
    const [collapsed, setCollapsed] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(false);
    const [progress, setProgress] = useState(0);

    function handleProcessTask() {
        window.electronAPI.processTask(task, task["key"]);
    }

    const handleProgress = (_, value, id) => {
        if (value === "start" && id === task["key"]) {
            setProcessing(true);
        } else if (value === "stop" && id === task["key"]) {
            console.log()
            setProcessing(false);
            setProcessed(true);
        } else if (id === task["key"]) {
            setProgress(Number(value));
        }
    }

    useEffect(() => {
        setProcessed(task["status"] == "processed");

        window.electronAPI.handleProgress(handleProgress);
        return () => {
            window.electronAPI.unhandleProgress(handleProgress);
        }
    }, [setProcessed])

    function toggleCollapsed() {
        setCollapsed(!collapsed);
    }   

    return (
        <div className='taskContainer'>
            <div className='controls'>
                <div className="titleContainer" onClick={toggleCollapsed}>
                    <span className="title">{getModelParams(task)["name"]}</span>
                    { collapsed
                    ? <img draggable="false" src={dropdownDown}/>
                    : <img draggable="false" src={dropdownUp}/>
                    }
                </div>

                { processing 
                ? <ProgressBar value={progress / 100} />
                :   processed 
                    ? <span className="proccessButton disabled">Processed</span>
                    : <button className="proccessButton" onClick={handleProcessTask}>Process</button>
                }               
            </div>
            

           
            { collapsed &&
                <div className='collapsed'>
                </div>
            }

            { !collapsed &&
                <div className='notCollapsed'>
                    <hr/>
                    <div className="section">
                        <div>
                            <span className="title">Date</span>
                            <span >{task["create_date"]}</span>
                        </div>
                    </div>
                    <div className="section">
                        <div>
                            <span className="title">Model</span>
                            <span className="model">{task["models"]}</span>
                        </div>
                    </div>
                    <div className="section">
                        <div className="fileContainer">
                            <span className="title">File</span>
                            <span className="file">{task["source_file_name"]}</span>
                        </div>
                        <div className="locationContainer">
                            <span className="title">Location</span>
                            <span className="location">{task["source_file_location"]}</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    )

    // return (
    //     <div className='container'>
    //         <Typography>{getModelParams(task)["name"]}</Typography>
    //         <Typography>{task["status"]}</Typography>
    //         <Typography>{task["create_date"]}</Typography>
    //         <Typography>{task["source_file_name"]}</Typography>
    //         <Typography>{task["source_file_location"]}</Typography>
    //         <Typography>{task["models"]}</Typography>
    //         {
    //             task["status"] === "unprocessed" &&
    //             <Button onClick={() => handleProcessTask()}>Process</Button>
    //         }
    //         {
    //             showProgress &&
    //             <LinearProgressWithLabel value={progress} />
    //         }
    //     </div>
    // )
}