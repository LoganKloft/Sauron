const express = require('express')
const app = express()
const port = 7654;

// capture all paths
app.get('*', (req, res) => {
    console.log(`Express > ${req.path}`);
    res.sendFile(req.path);
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port} cwd: ${__dirname}`);
});