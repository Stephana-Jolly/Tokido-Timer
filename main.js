const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

// ==================== WINDOW CREATION ====================
function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 560,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "src","index.html"));

  // Open DevTools in development (optional)
  // win.webContents.openDevTools();
}

// ==================== IPC HANDLERS ====================
ipcMain.on("window-minimize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on("window-close", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

// ==================== APP LIFECYCLE ====================
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


