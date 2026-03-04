/**
 * NurseBill — Preload Script
 * 
 * This is the SECURE BRIDGE between the dashboard UI (renderer) and the 
 * Mac file system (main process). It exposes only specific, safe functions
 * to the UI via window.electronAPI.
 * 
 * Think of it as a reception desk: the UI can ask for things, but it can't
 * wander into the back office (file system) on its own.
 */

const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  // ─── Folder Operations ───────────────────────────────────────────────
  
  /** Read the full lawyer → client → files tree from Desktop */
  readFolderTree: () => ipcRenderer.invoke('fs:read-tree'),
  
  /** Create a new lawyer folder on Desktop */
  createLawyerFolder: (lawyerName) => ipcRenderer.invoke('fs:create-lawyer-folder', lawyerName),
  
  /** Create a new client folder inside a lawyer folder */
  createClientFolder: (lawyerName, clientName) => ipcRenderer.invoke('fs:create-client-folder', lawyerName, clientName),
  
  /** Get the root path (~/Desktop/NurseBill Cases/) */
  getRootPath: () => ipcRenderer.invoke('fs:get-root-path'),
  
  /** Get files in a specific folder */
  getFiles: (folderPath) => ipcRenderer.invoke('fs:get-files', folderPath),

  // ─── File Operations ─────────────────────────────────────────────────
  
  /** Copy a file into the correct case folder */
  copyToCase: (sourcePath, lawyerName, clientName) => 
    ipcRenderer.invoke('fs:copy-to-case', sourcePath, lawyerName, clientName),
  
  /** Copy multiple files into the correct case folder (drag-and-drop) */
  copyFiles: (filePaths, lawyerName, clientName) => 
    ipcRenderer.invoke('fs:copy-files', filePaths, lawyerName, clientName),
  
  /** Get the full path from a File object (for drag-and-drop) */
  getPathForFile: (file) => {
    return webUtils.getPathForFile(file);
  },
  
  /** Move a file to a different case folder */
  moveToCase: (sourcePath, lawyerName, clientName) => 
    ipcRenderer.invoke('fs:move-to-case', sourcePath, lawyerName, clientName),
  
  /** Delete a file (moves to Mac Trash) */
  trashFile: (filePath) => ipcRenderer.invoke('fs:trash-file', filePath),
  
  /** Rename a file */
  renameFile: (oldPath, newName) => ipcRenderer.invoke('fs:rename-file', oldPath, newName),
  
  /** Open a file with its default Mac application */
  openFile: (filePath) => ipcRenderer.invoke('fs:open-file', filePath),
  
  /** Show a file/folder in Finder */
  openInFinder: (folderPath) => ipcRenderer.invoke('fs:open-in-finder', folderPath),

  // ─── Dialogs ─────────────────────────────────────────────────────────
  
  /** Open native file picker to select files */
  pickFiles: () => ipcRenderer.invoke('fs:pick-files'),

  /** Open native folder picker (for changing sync root) */
  pickFolder: () => ipcRenderer.invoke('fs:pick-folder'),

  /** Update the root sync folder path in the main process */
  setRootPath: (newPath) => ipcRenderer.invoke('fs:set-root-path', newPath),

  /** Read a file's raw bytes (for Excel import) */
  readFile: (filePath) => ipcRenderer.invoke('fs:read-file', filePath),
  
  /** Show "Save As" dialog (for invoices, exports) */
  saveFile: (defaultName, content, lawyerName, clientName) => 
    ipcRenderer.invoke('fs:save-file', defaultName, content, lawyerName, clientName),

  // ─── Google OAuth2 ───────────────────────────────────────────────────

  /** Start auth-code flow: opens browser, returns { accessToken, refreshToken, expiresAt } */
  googleAuthCode: (clientId, scopes) => ipcRenderer.invoke('google:auth-code', clientId, scopes),

  /** Exchange a refresh token for a new access token: returns { accessToken, expiresAt } */
  googleRefreshToken: (clientId, refreshToken) => ipcRenderer.invoke('google:refresh-token', clientId, refreshToken),

  // ─── App Info ────────────────────────────────────────────────────────

  /** Check if we're running inside Electron (vs. browser) */
  isElectron: () => ipcRenderer.invoke('app:is-electron'),
  
  /** Get app version */
  getVersion: () => ipcRenderer.invoke('app:version'),

  // ─── Data Persistence ────────────────────────────────────────────────
  
  /** Generate a PDF from invoice HTML and return as base64 (for email attachments) */
  generatePdfBuffer: (html) => ipcRenderer.invoke('generate-pdf-buffer', html),

  /** Generate a PDF from invoice HTML and save to the case folder */
  savePdf: (html, invoiceNo, lawyerName, clientName) =>
    ipcRenderer.invoke('invoice:save-pdf', { html, invoiceNo, lawyerName, clientName }),

  /** Save app data (clients, lawyers, emails, events) to JSON file */
  saveData: (data) => ipcRenderer.invoke('app:save-data', data),
  
  /** Load app data from JSON file */
  loadData: () => ipcRenderer.invoke('app:load-data'),

  // ─── Real-time Updates ───────────────────────────────────────────────
  
  /** Listen for file system change notifications */
  onFolderChange: (callback) => {
    ipcRenderer.on('fs:changed', (event, data) => callback(data));
  },
  
  /** Listen for refresh hints (polling-based) */
  onRefreshHint: (callback) => {
    ipcRenderer.on('fs:refresh-hint', () => callback());
  },

  /** Remove listeners (cleanup) */
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
