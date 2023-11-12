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

export async function processTask(event, task) {
    // write model parameters to ./src/python/config.json
    const config = {};
    config["yolo"] = task["model_params"]["yolo"];
    await writeFile("./src/python/config.json", JSON.stringify(config));

    // create python process for model
    const pythonProcess = spawn('python', ['./src/python/yolo.py'])

    handleProgress("start");

    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        handleProgress(data.toString());
    })

    pythonProcess.on('error', (err) => {
        console.log('Failed');
        console.log(err);
    })

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        handleProgress("stop");
    })
}