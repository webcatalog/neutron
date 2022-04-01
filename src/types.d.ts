declare global {
  type SearchEngineId =
    'google' | 'baidu' | 'yahoo' | 'bing' | 'yandex' | 'sogou' | 'duckduckgo'
    | 'ask' | 'aol' | 'ecosia' | 'startpage' | 'qwant' | 'ecosia';

  type UpdaterStatusType =
    'checking-for-update'
    | 'download-progress'
    | 'error'
    | 'update-available'
    | 'update-cancelled'
    | 'update-downloaded'
    | 'update-not-available';

  interface UpdaterState {
    status: UpdaterStatusType,
    info?: any,
  }
}

export {};
