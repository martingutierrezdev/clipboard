// Copyright (c) [2024] [mprojects]
// Licensed under the MIT License.

// Import Electron's contextBridge and ipcRenderer modules
const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe API to the renderer process using contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  // Function to send text to be copied to the clipboard
  copyText: (text) => ipcRenderer.send('copy-text', text),
  
  // Function to send image data to be copied to the clipboard
  copyImage: (imageData) => ipcRenderer.send('copy-image', imageData),
  
  // Listener to handle updates to the clipboard history
  onUpdateClipboard: (callback) => {
    // Remove previous listeners to prevent duplication
    ipcRenderer.removeAllListeners('update-clipboard');
    
    // Set up a new listener for clipboard updates
    ipcRenderer.on('update-clipboard', (event, clipboardHistory) => callback(clipboardHistory));
  },

  // Listener for theme change events (dark or light mode)
  onThemeChanged: (callback) => {
    ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
  },
});