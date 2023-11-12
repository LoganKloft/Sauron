import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'

function Query() {
    const navigate = useNavigate();
    return (
        <div>
            <Button variant="contained" onClick={() => navigate('/')}>Home</Button>
        </div>
    )
}

export default Query