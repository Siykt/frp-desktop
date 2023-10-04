import { FRPClientInitConfig } from '@/modules/FRP/Client';
import { BrowserWindow, app, ipcMain } from 'electron';
import ElectronStore from 'electron-store';
import { ChildProcess, exec } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { release } from 'node:os';
import { join } from 'node:path';
import { downloadFRPClient, getFRPClientInitConfig } from './helpers';
import { update } from './update';
import { EStoreInterface } from '@/modules/Store/Core';

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 360,
    height: 640,
    frame: false,
    resizable: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#403f4c',
      symbolColor: '#fff',
      height: 28,
    },
  });

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(indexHtml);
  }

  // Apply electron-updater
  update(win);
}

const eStore = new ElectronStore<EStoreInterface>();

app.whenReady().then(async () => {
  const isFirstRun = eStore.get('isFirstRun', true);

  if (isFirstRun) {
    const isWindows = process.platform === 'win32';
    const frpPath = join(app.getPath('userData'), 'frp');
    const frpcIni = join(frpPath, 'frpc.ini');
    const frpcPath = join(frpPath, isWindows ? 'frpc.exe' : 'frpc');
    eStore.set('frpPath', frpPath);
    eStore.set('frpcIni', frpcIni);
    eStore.set('frpcPath', frpcPath);
    eStore.set('isFirstRun', false);

    if (!fs.existsSync(frpcPath)) {
      await fsp.mkdir(frpPath);
    }
  }

  return createWindow();
});

app.on('window-all-closed', () => {
  win = null;
  cp?.kill('SIGKILL');
  cp = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    cp?.kill('SIGKILL');
    cp = null;
    createWindow();
  }
});

let cp: ChildProcess | null = null;

ipcMain.handle('run-frp-client', async (_, arg: FRPClientInitConfig) => {
  const frpcIni = eStore.get('frpcIni', '');
  const frpcPath = eStore.get('frpcPath', '');

  await fsp.writeFile(frpcIni, getFRPClientInitConfig(arg), { encoding: 'utf-8', flag: 'w+' });
  eStore.set('frpcConfig', arg);

  cp?.kill('SIGKILL');

  function runFRPClient() {
    // 使用最新的数据
    cp = exec(`"${eStore.get('frpcPath')}" -c "${eStore.get('frpcIni')}"`, (error, stdout, stderr) => {
      console.log('frpc', error, stdout, stderr);
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    });
  }

  if (fs.existsSync(frpcPath)) {
    runFRPClient();
  } else {
    if (!win) return false;
    // 获取最新版本
    await downloadFRPClient(win, eStore);
    runFRPClient();

    return false;
  }

  return true;
});

ipcMain.handle('stop-frp-client', () => {
  cp?.kill('SIGKILL');
  cp = null;
  return true;
});

ipcMain.handle('get-frp-client-config', () => {
  return eStore.get('frpcConfig', {
    common: {
      server_addr: '',
      server_port: '',
    },
    vhost_http_port: '',
    localConfigs: [{ local_port: '', custom_domains: '' }],
  });
});

ipcMain.handle('set-frp-client-config', (_, arg: FRPClientInitConfig) => {
  eStore.set('frpcConfig', arg);
  return true;
});
