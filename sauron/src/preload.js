// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveTask: (task) => ipcRenderer.invoke('saveTask', task),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getTasks: () => ipcRenderer.invoke('getTasks')
})