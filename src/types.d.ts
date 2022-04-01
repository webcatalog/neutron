/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
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
