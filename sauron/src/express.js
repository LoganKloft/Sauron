const { fork } = require("child_process");

var expressAbortController = null;
export function startExpressServer() {
    expressAbortController = new AbortController();
    const signal = expressAbortController.signal;
    // cwd of express app is sauron
    const child = fork("./src/express/main.js", [], { signal: signal, cwd: "./" });
    child.on("error", (err) => {

    })
}

export function stopExpressServer() {
    if (expressAbortController != null) {
        console.log("Calling expressAbortHandler");
        expressAbortController.abort();
    }
}