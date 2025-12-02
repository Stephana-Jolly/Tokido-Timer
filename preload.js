const { contextBridge, ipcRenderer } = require("electron");


// ==================== EXPOSE API TO RENDERER ====================
contextBridge.exposeInMainWorld("api", {
  minimize: () => {
    ipcRenderer.send("window-minimize");
  },
  close: () => {
    ipcRenderer.send("window-close");
  }
});

// ================ EXPOSE SOUND API TO RENDERER =================
contextBridge.exposeInMainWorld("soundAPI", {
  getAlarmPath: () => {
    return path.join(__dirname, "assets", "sounds", "alarm.mp3");
  }
});