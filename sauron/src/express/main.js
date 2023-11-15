const express = require('express')
const app = express()
const port = 7654;

// capture all paths
app.get('*', (req, res) => {
    path = req.path;

    // when using windows sendFile appends "C:"
    // however the paths the app uses already have /C: prepended
    if (path.startsWith("/C:/")) {
        path = path.substring(3);
    }

    console.log(`Express > ${path}`);
    res.sendFile(path);
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port} cwd: ${__dirname}`);
});