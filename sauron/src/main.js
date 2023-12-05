const { app, BrowserWindow, ipcMain, dialog, session } = require('electron');
const path = require('path');
import { saveTask, getTasks, processTask, init as initTasks } from './tasks.js';
import { resolveURL, getQueryMeta, getQueryData, init as initMeta } from './query.js';
import { startExpressServer, stopExpressServer } from './express.js';

import Icon from "./assets/icons/icons8-ring-512.png"
import { minimize, toggleMaximized, close, isDevToolsOpened, isMaximized, toggleDevTools } from './api.js';

export var _mainWindow = null;

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    "filters": [{ "name": "Movies", "extensions": ["mkv", "avi", "mp4"] }]
  })

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
  startExpressServer();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    useContentSize: true,
    icon:  path.join(__dirname, Icon),
    minWidth: 960,
    minHeight: 600,
    width: 960,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    icon: './assets/icons/icons8-ring-512.png'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.removeMenu();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  _mainWindow = mainWindow;
};

export function handleProgress(value, id) {
  _mainWindow.webContents.send("handleProgress", value, id);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // create query directory in data if not already there
  initMeta();

  // create task directory in data if not already there
  // create tasks.json in task directory if not already there
  initTasks();

  createWindow();

  // Setup IPC
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('saveTask', saveTask);
  ipcMain.handle('getTasks', getTasks);
  ipcMain.handle('processTask', processTask);
  ipcMain.handle('getQueryMeta', getQueryMeta);
  ipcMain.handle('getQueryData', getQueryData);
  ipcMain.handle('resolveURL', resolveURL);

  // Used for application control
  ipcMain.handle('app:minimize', minimize);
  ipcMain.handle('app:close', close);
  ipcMain.handle('app:is_maximized', isMaximized);
  ipcMain.handle('app:is_dev_tools_opened', isDevToolsOpened);
  ipcMain.handle('app:toggle_maximized', toggleMaximized);
  ipcMain.handle('app:toggle_dev_tools', toggleDevTools);

  _mainWindow.on("maximize", () => {
    _mainWindow.webContents.send("window:maximize");
  });

  _mainWindow.on("unmaximize", () => {
    _mainWindow.webContents.send("window:unmaximize");
  });

  _mainWindow.webContents.on("devtools-opened", () => {
    _mainWindow.webContents.send("window:open_dev_tools");
  });

  _mainWindow.webContents.on("devtools-closed", () => {
    _mainWindow.webContents.send("window:close_dev_tools");
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['media-src http://localhost:7654/']
      }
    })
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  stopExpressServer();
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
