import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './frontend/app.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
    <App />
);