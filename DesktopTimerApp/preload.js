const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopTimer', {
  resizeWindow: (mode, scale) => ipcRenderer.send('resize-window', { mode, scale: scale || 1 }),
  closeWidget: () => ipcRenderer.send('close-widget'),
  togglePin: (pinned) => ipcRenderer.send('toggle-pin', pinned)
});
