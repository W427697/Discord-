export interface BenchResults {
  branch: string;
  commit: string;
  timestamp: string;
  label: string;
  installTime: number;
  installSize: number;
  startManagerBuild: number;
  startPreviewBuild: number;
  startManagerRender: number;
  startPreviewRender: number;
  buildTime: number;
  browseManagerRender: number;
  browsePreviewRender: number;
  browseSizeTotal: number;
  browseSizeManagerTotal: number;
  browseSizeManagerVendors: number;
  browseSizeManagerUiDll: number;
  browseSizePreviewTotal: number;
  browseSizePreviewVendors: number;
  browseSizePreviewDocsDll: number;
}

export interface Config {
  install?: string;
  dev?: string;
  devUrl?: string;
  build?: string;
  serve?: string;
  serveUrl?: number;
  managerLoaded?: string;
  previewFrameLocator?: string;
  previewLoadedText?: string;
  /**
   * If set, wait this amount of time (ms) after the dev server
   * starts before starting the browser. Used for Histoire, which
   * is incompatible with `wait-on` for some reason.
   */
  waitOnTimeout?: number;
}
