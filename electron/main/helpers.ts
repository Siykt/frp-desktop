import { FRPClientInitConfig } from '@/modules/FRP/Client';
import { FetchListReleasesApiResponse, FetchListReleasesApiResponseAsset } from '@/modules/Github/Api';
import { EStore } from '@/modules/Store/Core';
import axios from 'axios';
import { BrowserWindow, ipcMain } from 'electron';
import { download } from 'electron-dl';
import ElectronStore from 'electron-store';
import extract from 'extract-zip';
import os from 'node:os';
import { join } from 'node:path';

export function getFRPClientInitConfig(initConfig: FRPClientInitConfig) {
  let config = '# Generated by FRP Desktop\n# Author Siykt<cnsiykt@163.com>\n';

  config += '\n[common]';
  config += `\nserver_addr = ${initConfig.common.server_addr}`;
  config += `\nserver_port = ${initConfig.common.server_port}\n`;

  for (let i = 0; i < initConfig.localConfigs.length; i++) {
    const localConfig = initConfig.localConfigs[i];
    config += '\n';
    config += `\n[web${i ? i : ''}]`;
    config += `\ntype = http`;
    config += `\nlocal_port = ${localConfig.local_port}`;
    config += `\ncustom_domains = ${localConfig.custom_domains}`;
  }

  return config;
}

export function getFRPReleaseByOSArch(asset: FetchListReleasesApiResponseAsset[]) {
  const arch = os.arch();
  const platform = process.platform;
  const osName = platform === 'win32' ? 'windows' : platform === 'darwin' ? 'darwin' : 'linux';

  if (arch === 'x64') {
    return asset.find((item) => item.name.includes(`${osName}_amd64`));
  } else if (arch === 'x32') {
    return asset.find((item) => item.name.includes(`${osName}_386`));
  } else {
    return asset.find((item) => item.name.includes(`${osName}_arm`));
  }
}

export async function downloadFRPClient(win: BrowserWindow, eStore: EStore) {
  const {
    data: { assets },
  } = await axios.get<FetchListReleasesApiResponse>('https://api.github.com/repos/fatedier/frp/releases/latest');

  const { browser_download_url, name } = getFRPReleaseByOSArch(assets) ?? {};

  if (!browser_download_url || !name) return console.warn('No FRP client found');

  const di = await download(win, browser_download_url, {
    onProgress: (p) => {
      ipcMain.emit('download-progress', p);
    },
  });

  const frpPath = eStore.get('frpPath');

  await extract(di.savePath, { dir: frpPath });

  eStore.set('frpcPath', join(frpPath, name.replace('.zip', ''), process.platform === 'win32' ? 'frpc.exe' : 'frpc'));
}