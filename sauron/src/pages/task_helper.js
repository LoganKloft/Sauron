export function getModelName(task) {
    return task["models"][0];
}

export function getModelParams(task) {
    return task["model_params"][getModelName(task)];
}