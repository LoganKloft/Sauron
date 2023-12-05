import { _mainWindow } from "./main";

/**
 * Gets the dev tools opened state
 * @returns {boolean}
 */
export const isDevToolsOpened = () => {
    return _mainWindow.webContents.isDevToolsOpened();
}
  
/**
 * Gets window's maximized state
 * @returns {boolean}
 */
export const isMaximized = () => {
    return _mainWindow.isMaximized();
}

/**
 * Toggles the dev tools opened state, returns true if
 * the dev tools are being opened, or false otherwise.
 * @returns {boolean}
 */
export const toggleDevTools = () => {
    if (_mainWindow.webContents.isDevToolsOpened()) {
        _mainWindow.webContents.closeDevTools();
        return false;
    } else {
        _mainWindow.webContents.openDevTools();
        return true;
    }
}

/**
 * Toggles the window's maximized state, returns true if
 * the window is being maximized, or false otherwise.
 * @returns {boolean}
 */
export const toggleMaximized = () => {
    if (_mainWindow.isMaximized()) {
        _mainWindow.unmaximize()
        return false;
    } else {
        _mainWindow.maximize();
        return true;
    }
}

/**
 * Closes the window
 */
export const close = () => {
    _mainWindow.close();
}

/**
 * Minimizes the window
 */
export const minimize = () => {
    _mainWindow.minimize();
}