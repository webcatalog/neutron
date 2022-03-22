/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { app } from '@electron/remote';

const getPicturePath = (pictureId, folderName = 'pictures') => [
  app.getPath('userData'), folderName, `${pictureId}.png`,
].join(window.process.platform === 'win32' ? '\\' : '/');

export default getPicturePath;
