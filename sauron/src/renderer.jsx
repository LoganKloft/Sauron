import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './frontend/app.jsx';

/**
 * The starting point for the app.
 */
const root = createRoot(document.getElementById('root'));
root.render(
    <App />
);