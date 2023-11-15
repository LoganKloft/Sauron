const { existsSync, mkdirSync } = require('fs');
const { readFile } = require('fs/promises');
const path = require('node:path');

export function init() {
    // check if ./src/data/query exists
    // if not create it
    if (!existsSync('./src/data/query')) {
        mkdirSync('./src/data/query');
    }
}

// given a list of labels and list of tasks:
// will return a list of objects, one for each task
// that object will contain a field for each label
// the field contains the count of the # of appearances of the label
// for the task
// each object will also contain the id of the task as
// a field called "key"
export async function getQueryMeta(event, labels, tasks) {
    let metaList = []
    for (const task of tasks) {
        const name = task["model_params"]["yolo"]["name"];
        const results = JSON.parse(await readFile(`./src/data/query/${name}_results.json`));

        let meta = {}
        meta["key"] = task["key"];

        for (const label of labels) {
            if (label in results) {
                meta[label] = Math.max(results[label]["counts"]);
            }
            else {
                meta[label] = 0
            }
        }

        metaList.push(meta);
    }

    return metaList;
}

// returns only the objects that match labels
// should probably limit the size of the data returned
// can limit the size by returning necessary data only
export async function getQueryData(event, labels, task) {
    const queryData = []

    const name = task["model_params"]["yolo"]["name"];
    const result = JSON.parse(await readFile(`./src/data/query/${name}_results.json`));

    for (const label of labels) {
        if (label in result) {
            const queryDataItem = {}
            queryDataItem[label] = result[label]
            queryData.push(queryDataItem)
        }
    }

    return queryData;
}

// url should start insid of the 'sauron' directory
// see how paths are defined in the other functions in this file
export async function resolveURL(event, url) {
    return path.resolve(url);
}