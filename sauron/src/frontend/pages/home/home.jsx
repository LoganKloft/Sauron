import React, { useState, useEffect } from 'react'

import { Task } from '../../components/task/task.jsx';

import './home.scss';

function Home({ setTab }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        (async function () {
            // Gets the task list from electron
            const result = await window.electronAPI.getTasks();

            // Store all the entries from tasks except for the one labeled "count"
            const temp = [];
            for (const key in result) {
                if (key !== "count") {
                    result[key]["key"] = key;
                    temp.push(result[key]);
                }
            }

            // sort the task to display the newest first
            temp.sort((a, b) => {
                return new Date(a.create_date) < new Date(b.create_date) ? 1 : -1;
            });

            setTasks(temp);
        })();
    }, [])

    return (
        <div className='homeContainer'>
            <span className="tasksTitle">Tasks</span>

            { tasks.length > 0 &&  
                <div className='hasTasks'>
                    <div className='tasksContainer'>
                    {tasks &&
                        tasks.map((task) => {
                            return <div className='spacer'><Task key={task["key"]} task={task} /></div>
                        })
                    }
                    </div>
                    <div className='queryContainer'>
                        <span>Want to find something?</span>
                        <button onClick={() => setTab("query")}>Query</button>
                    </div>
                </div>
            }

            { tasks.length <= 0 &&  
                <div className='hasNoTasks'>
                    <div className='uploadContainer'>
                        <span>No one has created any tasks!</span>
                        <button onClick={() => setTab("upload")}>Upload</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home