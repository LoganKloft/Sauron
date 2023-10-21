import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/index.jsx'
import Upload from './pages/upload/index.jsx'

const root = createRoot(document.getElementById('root'));
root.render(
    <>
        <HashRouter>
            <CssBaseline enableColorScheme />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='upload' element={<Upload />} />
            </Routes>
        </HashRouter>
    </>
);