const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage } = require('electron');
const path = require('path');

const COMPACT_SIZES = [
  { width: 280, height: 152 },
  { width: 340, height: 192 },
  { width: 440, height: 244 }
];
const COMPACT_SIZE = COMPACT_SIZES[0];
const EXPANDED_SIZE = { width: 460, height: 560 };

let mainWindow = null;
let tray = null;

function createWindow() {
  const primaryBounds = screen.getPrimaryDisplay().workArea;

  mainWindow = new BrowserWindow({
    width: COMPACT_SIZE.width,
    height: COMPACT_SIZE.height,
    x: primaryBounds.x + primaryBounds.width - COMPACT_SIZE.width - 24,
    y: primaryBounds.y + 24,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: true,
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 'screen-saver' level keeps the widget above other always-on-top
  // windows and most fullscreen apps on Windows.
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
  tray = new Tray(icon);
  tray.setToolTip('Desktop Timer');
  const menu = Menu.buildFromTemplate([
    {
      label: 'Show / Hide Timer',
      click: () => {
        if (!mainWindow) return;
        if (mainWindow.isVisible()) mainWindow.hide();
        else mainWindow.show();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) mainWindow.hide();
    else mainWindow.show();
  });
}

ipcMain.handle('resize-window', (event, payload) => {
  if (!mainWindow) return 1;
  const mode = payload.mode;
  const requested = payload.scale || 1;
  const bounds = mainWindow.getBounds();
  const level = [0, 1, 2].includes(payload.clock) ? payload.clock : 0;
  const base = mode === 'expanded' ? EXPANDED_SIZE : COMPACT_SIZES[level];
  const area = screen.getDisplayMatching(bounds).workArea;

  // Never let the window be bigger than the screen, and slide it back
  // on-screen if growing would push it past an edge.
  const scale = Math.min(requested, area.width / base.width, area.height / base.height);
  const width = Math.round(base.width * scale);
  const height = Math.round(base.height * scale);
  const x = Math.min(Math.max(bounds.x, area.x), area.x + area.width - width);
  const y = Math.min(Math.max(bounds.y, area.y), area.y + area.height - height);

  mainWindow.setResizable(true);
  mainWindow.setBounds({ x, y, width, height });
  mainWindow.setResizable(false);
  return scale;
});

ipcMain.on('close-widget', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('toggle-pin', (event, pinned) => {
  if (!mainWindow) return;
  mainWindow.setAlwaysOnTop(pinned, 'screen-saver');
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  // keep running in the tray; do not quit on window close
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
