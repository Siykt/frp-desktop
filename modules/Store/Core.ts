import type ElectronStore from 'electron-store';
import { FRPClientInitConfig } from '../FRP/Client';

export interface EStoreInterface {
  frpPath: string;
  frpcIni: string;
  frpcPath: string;
  isFirstRun: boolean;
  frpcConfig?: FRPClientInitConfig;
}

export type EStore = ElectronStore<EStoreInterface>;
