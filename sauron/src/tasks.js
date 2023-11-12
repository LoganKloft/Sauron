const { readFile, writeFile } = require('fs/promises');

export async function saveTask(event, task) {
    const tasks = JSON.parse(
        await readFile("./src/data/task/tasks.json"));

    const index = tasks["count"];
    tasks["count"] = tasks["count"] + 1;
    tasks[index] = task;

    await writeFile("./src/data/task/tasks.json", JSON.stringify(tasks));
}