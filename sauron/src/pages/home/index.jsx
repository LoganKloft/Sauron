import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'

function Home() {

    const navigate = useNavigate();

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('upload')}>Upload</Button>
        </div>
    )
}

export default Home