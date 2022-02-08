/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const { nativeImage } = require('electron');
const Jimp = require('jimp');

const getBufferAsync = (img, mime) => new Promise((resolve, reject) => {
  img.getBuffer(mime, (err, buffer) => {
    if (err) {
      reject(err);
    }
    resolve(buffer);
  });
});

// process icon to create tray icon with size 16x16, scale@2x: 32x32
const getTrayNativeImageFromPathAsync = async (iconPath) => {
  // convert jimp image to electron nativeImagwe
  const img = await Jimp.read(iconPath);

  const bufferScale1x = await getBufferAsync(
    img.resize(16, 16),
    Jimp.MIME_PNG,
  );

  const bufferScale2x = await getBufferAsync(
    img.resize(32, 32),
    Jimp.MIME_PNG,
  );

  const nImage = nativeImage.createEmpty();
  nImage.addRepresentation({
    scaleFactor: 1,
    height: 16,
    width: 16,
    buffer: bufferScale1x,
  });
  nImage.addRepresentation({
    scaleFactor: 2,
    height: 32,
    width: 32,
    buffer: bufferScale2x,
  });

  return nImage;
};

module.exports = getTrayNativeImageFromPathAsync;
