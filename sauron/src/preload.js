// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');


/**
 * Used to setup event listeners in the frontend.
 * @class Listener
 */
class Listener {
    /**
     * Registers the listener
     * @param {string} id 
     * @param {() => void} callback 
     */
    on = (id, callback) => {
        this.current[id] = callback;
    }

    /**
     * Removes the listener
     * @param {string} id 
     */
    remove = (id) => {
        delete this.current[id];
    }

    /**
     * Calls the listeners' callbacks
     */
    activate = () => {
        for (const id in this.current) {
            this.current[id]();
        }
    }

    /**
     * Holds the listeners callbacks
     * @type {{[key: string]: () => {}}}
     */
    current = {}
}


/**
 * Exposes certain functions and listeners to the front end
 */
contextBridge.exposeInMainWorld('electronAPI', {
    saveTask: (task) => ipcRenderer.invoke('saveTask', task),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getTasks: () => ipcRenderer.invoke('getTasks'),
    processTask: (task, id) => ipcRenderer.invoke('processTask', task, id),
    handleProgress: (callback) => ipcRenderer.on('handleProgress', callback),
    unhandleProgress: (callback) => ipcRenderer.off('handleProgress', callback),
    getQueryMeta: (labels, tasks) => ipcRenderer.invoke('getQueryMeta', labels, tasks),
    getQueryData: (labels, task) => ipcRenderer.invoke('getQueryData', labels, task),
    resolveURL: (url) => ipcRenderer.invoke('resolveURL', url),
    close: () => ipcRenderer.invoke('app:close'),
    minimize: () => ipcRenderer.invoke('app:minimize'),
    toggleMaximized: () => ipcRenderer.invoke('app:toggle_maximized'),
    toggleDevTools: () => ipcRenderer.invoke('app:toggle_dev_tools'),
    isMaximized: () => ipcRenderer.invoke('app:is_maximized'),
    isDevToolsOpened: () => ipcRenderer.invoke('app:is_dev_tools_opened'),
})

/**
 * A list of all the registerable listeners
 */
const listeners = {
    "window:maximize": new Listener(),
    "window:unmaximize": new Listener(),
    "window:open_dev_tools": new Listener(),
    "window:close_dev_tools": new Listener(),
};

/**
 * Register the listeners
 */
for (const channel in listeners) {
  ipcRenderer.on(channel, () => {
    listeners[channel].activate();
  });
}

/**
 * Expose the listeners in the frontend.
 */
contextBridge.exposeInMainWorld('electronListeners', listeners);
