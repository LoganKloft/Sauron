const { existsSync, mkdirSync } = require('fs');

export function init() {
    // check if ./src/data/query exists
    // if not create it
    if (!existsSync('./src/data/query')) {
        mkdirSync('./src/data/query');
    }
}