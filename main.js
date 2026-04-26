/**
 * NurseBill — Electron Main Process
 * 
 * This is the "brain" of the desktop app. It runs with full access to the Mac
 * file system and handles:
 *   - Reading/writing files in ~/Desktop/LawyerName/ClientName folders
 *   - Watching folders for changes in real-time
 *   - Creating new folders when new cases are added
 *   - Moving/copying files between folders
 *   - Downloading files directly into the correct case folder
 */

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');
const http   = require('http');
const crypto = require('crypto');

// Load .env.local (dev) or .env.local packaged alongside main.js (prod)
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// ─── Google OAuth2 Desktop Client ────────────────────────────────────────────
// In Google Cloud Console: APIs & Services → Credentials → Create Credential
// → OAuth client ID → Desktop app.  Copy the client_secret below.
// (For Desktop/Installed apps, the client_secret is embedded by design — this
//  is standard practice and accepted by Google's OAuth policies.)
const GOOGLE_CLIENT_SECRET = process.env.NURSEBILL_GOOGLE_SECRET || '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';

// ─── Local HTTP server (production only) ─────────────────────────────────────
// Google OAuth requires an http:// origin — file:// won't work.
// We serve the built dist/ folder on localhost:17839 so the app URL matches
// what's registered in Google Cloud Console.
const PROD_PORT = 17839;
let staticServer = null;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

function startStaticServer() {
  const distPath = path.join(__dirname, 'dist');
  return new Promise((resolve) => {
    staticServer = http.createServer((req, res) => {
      // Strip query string and decode URI
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.normalize(path.join(distPath, urlPath === '/' ? 'index.html' : urlPath));

      // Block path traversal
      if (!filePath.startsWith(distPath)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }

      // SPA fallback — unknown paths serve app.html (the React entry)
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) filePath = path.join(distPath, 'app.html');
      } catch {
        filePath = path.join(distPath, 'app.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';

      try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      } catch {
        res.writeHead(404); res.end('Not found');
      }
    });

    staticServer.listen(PROD_PORT, '127.0.0.1', () => {
      console.log(`NurseBill static server → http://127.0.0.1:${PROD_PORT}`);
      resolve();
    });
  });
}

// ─── Configuration ───────────────────────────────────────────────────────────
// The root folder where all case files live on the Mac desktop
const DESKTOP_PATH = path.join(os.homedir(), 'Desktop');
const ROOT_FOLDER_NAME = 'NurseBill Cases';
let ROOT_PATH = path.join(DESKTOP_PATH, ROOT_FOLDER_NAME);

let mainWindow = null;
let fileWatcher = null;

// ─── Window Setup ────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: 'hiddenInset', // Native Mac look with traffic lights
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#f7f5f2',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // Security: keeps renderer separate from Node
      nodeIntegration: false,  // Security: no direct Node access in renderer
    },
  });

  // app.html is the Electron/React entry — index.html is the Vercel marketing page
  // Both dev and prod use http://localhost:17839 so Google OAuth works in both
  if (process.argv.includes('--dev')) {
    mainWindow.loadURL(`http://localhost:${PROD_PORT}/app.html`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`http://localhost:${PROD_PORT}/app.html`);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (fileWatcher) {
      fileWatcher.close();
    }
  });
}

app.whenReady().then(async () => {
  ensureRootFolder();

  // Start the local HTTP server in production before opening the window
  if (!process.argv.includes('--dev')) {
    await startStaticServer();
  }

  createWindow();
  startFileWatcher();

  // ── Auto-updater (production only) ──────────────────────────────────────
  if (!process.argv.includes('--dev')) {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('update-available', (info) => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `NurseBill ${info.version} is available and downloading in the background.`,
        detail: 'You\'ll be prompted to restart once the download is complete.',
        buttons: ['OK'],
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'NurseBill has been updated.',
        detail: 'Restart now to apply the update, or it will install automatically when you next quit.',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
      }).then(({ response }) => {
        if (response === 0) autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.on('error', (err) => {
      console.error('AutoUpdater error:', err?.message);
    });

    // Check after a short delay so the window is fully ready
    setTimeout(() => autoUpdater.checkForUpdates(), 3000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (fileWatcher)   fileWatcher.close();
  if (staticServer)  staticServer.close();
  if (process.platform !== 'darwin') app.quit();
});


// ═══════════════════════════════════════════════════════════════════════════════
// FILE SYSTEM OPERATIONS
// These are called from the renderer (dashboard UI) via IPC
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ensure the root "NurseBill Cases" folder exists on the Desktop
 */
function ensureRootFolder() {
  if (!fs.existsSync(ROOT_PATH)) {
    fs.mkdirSync(ROOT_PATH, { recursive: true });
    console.log(`Created root folder: ${ROOT_PATH}`);
  }
}

/**
 * Create a lawyer folder: ~/Desktop/NurseBill Cases/Anderson, Karen/
 */
function createLawyerFolder(lawyerName) {
  const folderPath = path.join(ROOT_PATH, lawyerName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created lawyer folder: ${folderPath}`);
  }
  return folderPath;
}

/**
 * Create a client folder: ~/Desktop/NurseBill Cases/Anderson, Karen/Thompson, David/
 */
function createClientFolder(lawyerName, clientName) {
  const lawyerPath = createLawyerFolder(lawyerName);
  const clientPath = path.join(lawyerPath, clientName);
  if (!fs.existsSync(clientPath)) {
    fs.mkdirSync(clientPath, { recursive: true });
    console.log(`Created client folder: ${clientPath}`);
  }
  return clientPath;
}

/**
 * Read the entire folder tree from the Desktop
 * Returns: { lawyers: [{ name, path, clients: [{ name, path, files: [...] }] }] }
 */
function readFolderTree() {
  ensureRootFolder();
  const tree = { rootPath: ROOT_PATH, lawyers: [] };

  try {
    const lawyerDirs = fs.readdirSync(ROOT_PATH, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'));

    for (const lawyerDir of lawyerDirs) {
      const lawyerPath = path.join(ROOT_PATH, lawyerDir.name);
      const lawyer = {
        name: lawyerDir.name,
        path: lawyerPath,
        clients: [],
      };

      const clientDirs = fs.readdirSync(lawyerPath, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'));

      for (const clientDir of clientDirs) {
        const clientPath = path.join(lawyerPath, clientDir.name);
        const client = {
          name: clientDir.name,
          path: clientPath,
          files: getFilesInFolder(clientPath),
        };
        lawyer.clients.push(client);
      }

      // Also get any files directly in the lawyer folder (not in a client subfolder)
      lawyer.files = getFilesInFolder(lawyerPath);
      tree.lawyers.push(lawyer);
    }
  } catch (err) {
    console.error('Error reading folder tree:', err);
  }

  return tree;
}

/**
 * Get all files in a folder (non-recursive)
 */
function getFilesInFolder(folderPath) {
  try {
    return fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(d => d.isFile() && !d.name.startsWith('.'))
      .map(d => {
        const filePath = path.join(folderPath, d.name);
        const stats = fs.statSync(filePath);
        return {
          name: d.name,
          path: filePath,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          created: stats.birthtime.toISOString(),
          extension: path.extname(d.name).toLowerCase().replace('.', ''),
        };
      });
  } catch (err) {
    console.error('Error reading files:', err);
    return [];
  }
}

/**
 * Format a file size in bytes to human readable
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Copy a file into the correct case folder
 */
function copyFileToCase(sourcePath, lawyerName, clientName) {
  const destFolder = createClientFolder(lawyerName, clientName);
  const fileName = path.basename(sourcePath);
  const destPath = path.join(destFolder, fileName);
  
  // If file already exists, add a number suffix
  let finalPath = destPath;
  let counter = 1;
  while (fs.existsSync(finalPath)) {
    const ext = path.extname(fileName);
    const base = path.basename(fileName, ext);
    finalPath = path.join(destFolder, `${base} (${counter})${ext}`);
    counter++;
  }
  
  fs.copyFileSync(sourcePath, finalPath);
  console.log(`Copied file to: ${finalPath}`);
  return finalPath;
}

/**
 * Move a file to a different case folder
 */
function moveFileToCase(sourcePath, lawyerName, clientName) {
  const newPath = copyFileToCase(sourcePath, lawyerName, clientName);
  fs.unlinkSync(sourcePath); // Remove original
  return newPath;
}

/**
 * Delete a file (moves to Trash on Mac)
 */
async function trashFile(filePath) {
  try {
    await shell.trashItem(filePath);
    return true;
  } catch (err) {
    console.error('Error trashing file:', err);
    return false;
  }
}

/**
 * Open a file with its default application
 */
function openFile(filePath) {
  shell.openPath(filePath);
}

/**
 * Open a folder in Finder
 */
function openInFinder(folderPath) {
  shell.showItemInFolder(folderPath);
}

/**
 * Show a "Save As" dialog and save content to the chosen location
 * Used for generating invoices, reports, etc.
 */
async function saveFileDialog(defaultName, content, lawyerName, clientName) {
  // Default to the client's case folder
  const defaultPath = clientName 
    ? path.join(ROOT_PATH, lawyerName, clientName, defaultName)
    : path.join(ROOT_PATH, lawyerName, defaultName);

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath,
    filters: [
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content);
    return result.filePath;
  }
  return null;
}

/**
 * Show an "Open File" dialog to pick files for upload
 */
async function pickFiles() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'bmp'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled) {
    return result.filePaths.map(fp => ({
      name: path.basename(fp),
      path: fp,
      size: fs.statSync(fp).size,
      extension: path.extname(fp).toLowerCase().replace('.', ''),
    }));
  }
  return [];
}


// ═══════════════════════════════════════════════════════════════════════════════
// FILE WATCHER
// Watches the root folder for changes and notifies the renderer in real-time
// ═══════════════════════════════════════════════════════════════════════════════

function startFileWatcher() {
  // We use a simple polling approach that works cross-platform
  // In production, you'd use chokidar for more efficient watching:
  //
  //   const chokidar = require('chokidar');
  //   fileWatcher = chokidar.watch(ROOT_PATH, {
  //     ignored: /(^|[\/\\])\./,
  //     persistent: true,
  //     depth: 3,
  //   });
  //   fileWatcher.on('all', (event, filePath) => {
  //     if (mainWindow) {
  //       mainWindow.webContents.send('fs:changed', { event, path: filePath });
  //     }
  //   });

  // Simple polling fallback (checks every 3 seconds)
  const pollInterval = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('fs:refresh-hint');
    }
  }, 3000);

  // Store reference so we can clean up
  fileWatcher = { close: () => clearInterval(pollInterval) };
}


// ═══════════════════════════════════════════════════════════════════════════════
// DATA PERSISTENCE
// Saves app data (clients, lawyers, emails, events) to a JSON file
// This survives app restarts and reloads
// ═══════════════════════════════════════════════════════════════════════════════

const DATA_FILE_NAME = 'nursebill-data.json';
let DATA_FILE_PATH = path.join(ROOT_PATH, DATA_FILE_NAME);

/**
 * Save app data to JSON file
 */
function saveAppData(data) {
  try {
    ensureRootFolder();
    const fullPath = path.join(ROOT_PATH, DATA_FILE_NAME);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`App data saved: ${fullPath}`);
    return true;
  } catch (err) {
    console.error('Error saving app data:', err);
    return false;
  }
}

/**
 * Load app data from JSON file
 */
function loadAppData() {
  try {
    ensureRootFolder();
    const fullPath = path.join(ROOT_PATH, DATA_FILE_NAME);
    if (!fs.existsSync(fullPath)) {
      console.log('No existing data file found, starting fresh');
      return null;
    }
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    console.log(`App data loaded: ${fullPath}`);
    return data;
  } catch (err) {
    console.error('Error loading app data:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS
// These bridge the renderer (UI) ↔ main process (file system)
// The renderer calls these via window.electronAPI (see preload.js)
// ═══════════════════════════════════════════════════════════════════════════════

// Read the full folder tree
ipcMain.handle('fs:read-tree', () => {
  return readFolderTree();
});

// Save app data
ipcMain.handle('app:save-data', (event, data) => {
  return saveAppData(data);
});

// Load app data
ipcMain.handle('app:load-data', () => {
  return loadAppData();
});

// Create a new lawyer folder
ipcMain.handle('fs:create-lawyer-folder', (event, lawyerName) => {
  return createLawyerFolder(lawyerName);
});

// Create a new client folder under a lawyer
ipcMain.handle('fs:create-client-folder', (event, lawyerName, clientName) => {
  return createClientFolder(lawyerName, clientName);
});

// Copy file(s) into a case folder
ipcMain.handle('fs:copy-to-case', (event, sourcePath, lawyerName, clientName) => {
  return copyFileToCase(sourcePath, lawyerName, clientName);
});

// Move a file to a different case folder
ipcMain.handle('fs:move-to-case', (event, sourcePath, lawyerName, clientName) => {
  return moveFileToCase(sourcePath, lawyerName, clientName);
});

// Delete a file (to Trash)
ipcMain.handle('fs:trash-file', (event, filePath) => {
  return trashFile(filePath);
});

// Open a file with default app
ipcMain.handle('fs:open-file', (event, filePath) => {
  openFile(filePath);
  return true;
});

// Open folder in Finder
ipcMain.handle('fs:open-in-finder', (event, folderPath) => {
  openInFinder(folderPath);
  return true;
});

// Pick files via native dialog
ipcMain.handle('fs:pick-files', () => {
  return pickFiles();
});

// Save file dialog (for invoices, exports)
ipcMain.handle('fs:save-file', (event, defaultName, content, lawyerName, clientName) => {
  return saveFileDialog(defaultName, content, lawyerName, clientName);
});

// Get the root path
ipcMain.handle('fs:get-root-path', () => {
  return ROOT_PATH;
});

// Pick a folder via native dialog (for changing sync root)
ipcMain.handle('fs:pick-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: ROOT_PATH,
    message: 'Choose the folder where NurseBill cases are stored',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Update the root path (called after user picks a folder)
ipcMain.handle('fs:set-root-path', (event, newPath) => {
  ROOT_PATH = newPath;
  ensureRootFolder();
  return ROOT_PATH;
});

// Get files in a specific folder
ipcMain.handle('fs:get-files', (event, folderPath) => {
  return getFilesInFolder(folderPath);
});

// Rename a file
ipcMain.handle('fs:rename-file', (event, oldPath, newName) => {
  const dir = path.dirname(oldPath);
  const newPath = path.join(dir, newName);
  fs.renameSync(oldPath, newPath);
  return newPath;
});

// Read a file's raw bytes (used for Excel import in the renderer)
ipcMain.handle('fs:read-file', (event, filePath) => {
  return fs.readFileSync(filePath);
});

// Copy multiple files to a case folder (used by drag-and-drop)
ipcMain.handle('fs:copy-files', async (event, filePaths, lawyerName, clientName) => {
  const results = [];
  for (const sourcePath of filePaths) {
    try {
      const result = copyFileToCase(sourcePath, lawyerName, clientName);
      results.push({ path: sourcePath, success: true, result });
    } catch (err) {
      results.push({ path: sourcePath, success: false, error: err.message });
    }
  }
  return results;
});

// Check if running in Electron
ipcMain.handle('app:is-electron', () => true);

// Get app version
ipcMain.handle('app:version', () => app.getVersion());

// Generate a PDF from invoice HTML and return as base64 (used for email attachments)
ipcMain.handle('generate-pdf-buffer', async (event, html) => {
  const { BrowserWindow: BW } = require('electron');
  const win = new BW({ show: false, width: 800, height: 1100, webPreferences: { nodeIntegration: false, contextIsolation: true } });
  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    const pdf = await win.webContents.printToPDF({ printBackground: true, pageSize: 'Letter' });
    return pdf.toString('base64');
  } finally {
    win.close();
  }
});

// Generate a PDF from invoice HTML and save to the client's case folder
ipcMain.handle('invoice:save-pdf', async (event, { html, invoiceNo, lawyerName, clientName }) => {
  const { BrowserWindow: BW } = require('electron');
  const pdfWin = new BW({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: true } });
  try {
    await pdfWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    const pdfBuffer = await pdfWin.webContents.printToPDF({
      printBackground: true,
      pageSize: 'Letter',
      margins: { marginType: 'custom', top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    });
    const fileName = `Invoice ${invoiceNo}.pdf`;
    let filePath;
    if (lawyerName && clientName) {
      const destFolder = createClientFolder(lawyerName, clientName);
      filePath = path.join(destFolder, fileName);
      fs.writeFileSync(filePath, pdfBuffer);
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: path.join(ROOT_PATH, fileName),
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });
      if (result.canceled) return { success: false };
      filePath = result.filePath;
      fs.writeFileSync(filePath, pdfBuffer);
    }
    return { success: true, filePath };
  } finally {
    pdfWin.close();
  }
});

// ─── Google OAuth2 Authorization Code Flow ───────────────────────────────────

// Opens Google auth in the user's browser via a loopback redirect, then exchanges
// the code for an access token + refresh token.
// Returns { accessToken, refreshToken, expiresAt }.
ipcMain.handle('google:auth-code', async (event, clientId, scopes) => {
  const codeVerifier  = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const state         = crypto.randomBytes(16).toString('hex');
  let capturedRedirectUri = '';

  const authCode = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqUrl   = new URL(req.url, 'http://127.0.0.1');
      const code     = reqUrl.searchParams.get('code');
      const retState = reqUrl.searchParams.get('state');
      const errParam = reqUrl.searchParams.get('error');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2 style="color:#2563eb">&#10003; Connected to Google</h2>
        <p>You can close this tab and return to NurseBill.</p>
      </body></html>`);
      server.close();

      if (errParam)           { reject(new Error(`Google auth denied: ${errParam}`)); return; }
      if (retState !== state) { reject(new Error('OAuth state mismatch'));            return; }
      if (!code)              { reject(new Error('No authorization code returned')); return; }
      resolve(code);
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      capturedRedirectUri = `http://127.0.0.1:${port}`;

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id',             clientId);
      authUrl.searchParams.set('redirect_uri',          capturedRedirectUri);
      authUrl.searchParams.set('response_type',         'code');
      authUrl.searchParams.set('scope',                 scopes);
      authUrl.searchParams.set('access_type',           'offline');
      authUrl.searchParams.set('prompt',                'consent'); // ensures refresh_token returned
      authUrl.searchParams.set('state',                 state);
      authUrl.searchParams.set('code_challenge',        codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');

      shell.openExternal(authUrl.toString());
    });

    setTimeout(() => { server.close(); reject(new Error('Google auth timed out')); }, 5 * 60 * 1000);
  });

  // Exchange authorization code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({
      code:          authCode,
      client_id:     clientId,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri:  capturedRedirectUri,
      grant_type:    'authorization_code',
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const tokens = await tokenRes.json();
  return {
    accessToken:  tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt:    Date.now() + (tokens.expires_in || 3600) * 1000,
  };
});

// Use a stored refresh_token to silently obtain a new access_token.
// Returns { accessToken, expiresAt }.
ipcMain.handle('google:refresh-token', async (event, clientId, refreshToken) => {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({
      refresh_token: refreshToken,
      client_id:     clientId,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type:    'refresh_token',
    }).toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token refresh failed: ${errText}`);
  }

  const tokens = await tokenRes.json();
  return {
    accessToken: tokens.access_token,
    expiresAt:   Date.now() + (tokens.expires_in || 3600) * 1000,
  };
});
