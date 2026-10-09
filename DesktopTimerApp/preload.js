const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopTimer', {
  resizeWindow: (mode, scale, clock) => ipcRenderer.invoke('resize-window', { mode, scale: scale || 1, clock: clock || 0 }),
  closeWidget: () => ipcRenderer.send('close-widget'),
  togglePin: (pinned) => ipcRenderer.send('toggle-pin', pinned)
});
