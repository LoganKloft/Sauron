// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

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




class Listener {
    on = (id, callback) => {
        this.current[id] = callback;
    }

    remove = (id) => {
        delete this.current[id];
    }

    activate = () => {
        for (const id in this.current) {
            this.current[id]();
        }
    }

    current = {}
}

// Next we register all the listeners
const listeners = {
    "window:maximize": new Listener(),
    "window:unmaximize": new Listener(),
    "window:open_dev_tools": new Listener(),
    "window:close_dev_tools": new Listener(),
};

for (const channel in listeners) {
  ipcRenderer.on(channel, () => {
    listeners[channel].activate();
  });
}
// And expose them in the front end
contextBridge.exposeInMainWorld('electronListeners', listeners);

  