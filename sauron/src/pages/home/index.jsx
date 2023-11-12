import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function Home() {

    const navigate = useNavigate();

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('upload')}>Upload</Button>
            <Fab color="primary" aria-label="add" onClick={() => navigate('upload')}>
                <AddIcon />
            </Fab>
            <Link href="https://icons8.com/icon/41528/one-ring">Ring</Link> icon by <Link href="https://icons8.com">Icons8</Link>
        </div>
    )
}

export default Home