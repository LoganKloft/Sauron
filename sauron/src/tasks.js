const { readFile, writeFile } = require('fs/promises');
const { existsSync, mkdirSync, copyFileSync } = require('fs');
const { spawn } = require('child_process');
const { handleProgress } = require('./main.js');

export async function saveTask(event, task) {
    const tasks = JSON.parse(
        await readFile("./src/data/task/tasks.json"));

    const index = tasks["count"];
    tasks["count"] = tasks["count"] + 1;
    tasks[index] = task;

    await writeFile("./src/data/task/tasks.json", JSON.stringify(tasks));
}

export async function getTasks() {
    const tasks = JSON.parse(await readFile("./src/data/task/tasks.json"));
    return tasks;
}

export function init() {
    // check if ./src/data/task exists
    // if not create it
    if (!existsSync('./src/data/task')) {
        mkdirSync('./src/data/task');
    }

    // check if ./src/data/tasks.json exists
    // if not create it
    if (!existsSync('./src/data/task/tasks.json')) {
        copyFileSync('./src/templates/task/tasks.json', './src/data/task/tasks.json');
    }
}

export function getModelName(task) {
    return task["models"][0];
}

export function getModelParams(task) {
    return task["model_params"][getModelName(task)];
}

async function setTaskStatus(id, status) {
    const tasks = JSON.parse(await readFile("./src/data/task/tasks.json"));

    tasks[id]["status"] = status;

    await writeFile("./src/data/task/tasks.json", JSON.stringify(tasks));
}

// pass in a task which contains all necessary information
// id allows us to access the task in tasks.json
// model tells us which model to run, we don't process
// all at once
export async function processTask(event, task, id) {
    // write model parameters to ./src/python/config.json
    const config = {};
    config[getModelName(task)] = getModelParams(task);
    await writeFile("./src/python/config.json", JSON.stringify(config));

    // create python process for model
    const pythonProcess = spawn('python', [`./src/python/${getModelName(task)}.py`])

    handleProgress("start", id);

    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        handleProgress(data.toString(), id);
    })

    pythonProcess.on('error', (err) => {
        console.log('Failed');
        console.log(err);
    })

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        handleProgress("stop", id);
    })

    await setTaskStatus(id, "processed");
}