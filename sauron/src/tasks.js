const { readFile, writeFile } = require('fs/promises');
const { existsSync, mkdirSync, copyFileSync } = require('fs');

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