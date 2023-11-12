const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
import { saveTask, init as initTasks } from './tasks.js';
import { init as initMeta } from './meta.js';

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return { fpath: filePaths[0], fname: path.basename(filePaths[0]) }
  }
  return { fpath: undefined, fname: undefined };
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    icon: './assets/icons/icons8-ring-512.png'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // create query directory in data if not already there
  // create meta.json in query directory if not already there
  initMeta();

  // create task directory in data if not already there
  // create tasks.json in task directory if not already there
  initTasks();

  createWindow();
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('saveTask', saveTask);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
