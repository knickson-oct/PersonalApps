const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopTimer', {
  resizeWindow: (mode) => ipcRenderer.send('resize-window', mode),
  closeWidget: () => ipcRenderer.send('close-widget'),
  togglePin: (pinned) => ipcRenderer.send('toggle-pin', pinned)
});
