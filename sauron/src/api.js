import { _mainWindow } from "./main";

export const isDevToolsOpened = () => {
    return _mainWindow.webContents.isDevToolsOpened();
}
  
export const isMaximized = () => {
    return _mainWindow.isMaximized();
}

export const toggleDevTools = () => {
    if (_mainWindow.webContents.isDevToolsOpened()) {
        _mainWindow.webContents.closeDevTools();
        return false;
    } else {
        _mainWindow.webContents.openDevTools();
        return true;
    }
}

export const toggleMaximized = () => {
    if (_mainWindow.isMaximized()) {
        _mainWindow.unmaximize()
        return false;
    } else {
        _mainWindow.maximize();
        return true;
    }
}

export const close = () => {
    _mainWindow.close();
}

export const minimize = () => {
    _mainWindow.minimize();
}