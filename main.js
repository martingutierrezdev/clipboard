// Copyright (c) [2024] [mprojects]
// Licensed under the MIT License.

// Import necessary Electron modules and path for file management
const { app, BrowserWindow, clipboard, ipcMain, nativeImage, nativeTheme, screen } = require('electron');
const path = require('path');

let mainWindow; // Main application window
let clipboardHistory = []; // Clipboard history array

// Function to create the main application window
function createWindow() {
  console.log('Creating main window');

  // Get the primary display's working area dimensions
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = 320;
  const windowHeight = 600;

  // Calculate position to place the window in the bottom-right corner
  const x = width - windowWidth;
  const y = height - windowHeight;

  // Create the main window with defined properties
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x,
    y: y,
    icon: path.join(__dirname, 'assets/icon.icns'), // Application icon path
    transparent: false,
    frame: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script path
      contextIsolation: true, // Security setting
      nodeIntegration: false, // Prevent direct Node.js access
      enableRemoteModule: false, // Disable remote module for security
    },
  });

  // Load the HTML file for the main window and send theme info
  mainWindow.loadFile('index.html').then(() => {
    mainWindow.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    // Send the current clipboard history immediately after loading the window
    mainWindow.webContents.send('update-clipboard', clipboardHistory);
  });
  console.log('Main window created and index.html loaded');
}

// Listen for system theme updates to apply dark or light mode
nativeTheme.on('updated', () => {
  mainWindow.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
});

// Function to monitor the clipboard for new content
function checkClipboard() {
  const currentText = clipboard.readText();
  const currentImage = clipboard.readImage();

  // Avoid duplicate images
  if (currentImage && !currentImage.isEmpty()) {
    const imageData = currentImage.toDataURL();

    const imageExists = clipboardHistory.some(item => item.type === 'image' && item.data === imageData);

    if (!imageExists) {
      clipboardHistory.unshift({ type: 'image', data: imageData });
      sendClipboardHistory();
    }
  }
  
  // Avoid duplicate text entries
  else if (currentText && (!clipboardHistory.length || clipboardHistory[0].data !== currentText)) {
    const textExists = clipboardHistory.some(item => item.type === 'text' && item.data === currentText);

    if (!textExists) {
      clipboardHistory.unshift({ type: 'text', data: currentText });
      sendClipboardHistory();
    }
  }

  // Limit the clipboard history to the last 10 entries
  if (clipboardHistory.length > 10) {
    clipboardHistory.pop();
  }
}

// Send updated clipboard history to the renderer process
function sendClipboardHistory() {
  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
    mainWindow.webContents.send('update-clipboard', clipboardHistory);
  }
}

// Listen for copy-text events from the renderer and copy text to the clipboard
ipcMain.on('copy-text', (event, text) => {
  clipboard.writeText(text);
});

// Listen for copy-image events from the renderer and copy images to the clipboard
ipcMain.on('copy-image', (event, imageData) => {
  const image = nativeImage.createFromDataURL(imageData);
  clipboard.writeImage(image);
});

// Run the app and create the main window when ready, checking clipboard every 2 seconds
app.whenReady().then(() => {
  createWindow();
  setInterval(checkClipboard, 2000);
});

// On macOS, recreate the window when the dock icon is clicked if no windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});