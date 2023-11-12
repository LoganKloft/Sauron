import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Task from './task.jsx';

function Home() {

    const navigate = useNavigate();
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        (async function () {
            const result = await window.electronAPI.getTasks();
            const temp = [];
            for (const key in result) {
                if (key !== "count") {
                    result[key]["key"] = key;
                    temp.push(result[key]);
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

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('upload')}>Upload</Button>
            {tasks &&
                tasks.map((task) => {
                    return <Task key={task["key"]} task={task} />
                })
            }
            <Fab color="primary" aria-label="add" onClick={() => navigate('upload')}>
                <AddIcon />
            </Fab>
            <Link href="https://icons8.com/icon/41528/one-ring">Ring</Link> icon by <Link href="https://icons8.com">Icons8</Link>
        </div>
    )
}

export default Home