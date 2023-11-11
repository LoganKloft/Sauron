import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'

function Home() {

    const navigate = useNavigate();

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('upload')}>Upload</Button>
            <Link href="https://icons8.com/icon/41528/one-ring">Ring</Link> icon by <Link href="https://icons8.com">Icons8</Link>
        </div>
    )
}

export default Home