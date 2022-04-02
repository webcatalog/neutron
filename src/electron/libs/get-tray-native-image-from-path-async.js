/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const { nativeImage } = require('electron');
const Jimp = process.env.NODE_ENV === 'production' ? require('jimp').default : require('jimp');

const getBufferAsync = (img, mime) => new Promise((resolve, reject) => {
  img.getBuffer(mime, (err, buffer) => {
    if (err) {
      reject(err);
    }
    resolve(buffer);
  });
});

const trayIconSize = 16;

// process icon to create tray icon with size 16x16, scale@2x: 32x32
const getTrayNativeImageFromPathAsync = async (iconPath, templateImage = false) => {
  // convert jimp image to electron nativeImagwe
  const img = await Jimp.read(iconPath);

  if (templateImage) {
    for (let w = 0; w < img.bitmap.width; w += 1) {
      for (let h = 0; h < img.bitmap.height; h += 1) {
        const pixelHex = img
          .getPixelColor(w, h); // returns the colour of that pixel e.g. 0xFFFFFFFF
        if (pixelHex === 0xFFFFFFFF) {
          img.setPixelColor(0, w, h);
        } else {
          img.setPixelColor(Jimp.rgbaToInt(0, 0, 0, 255), w, h);
        }
      }
    }
  }

  const bufferScale1x = await getBufferAsync(
    img.resize(trayIconSize, trayIconSize),
    Jimp.MIME_PNG,
  );

  const bufferScale2x = await getBufferAsync(
    img.resize(trayIconSize * 2, trayIconSize * 2),
    Jimp.MIME_PNG,
  );

  const nImage = nativeImage.createEmpty();
  nImage.addRepresentation({
    scaleFactor: 1,
    height: trayIconSize,
    width: trayIconSize,
    buffer: bufferScale1x,
  });
  nImage.addRepresentation({
    scaleFactor: 2,
    height: trayIconSize * 2,
    width: trayIconSize * 2,
    buffer: bufferScale2x,
  });

  nImage.setTemplateImage(Boolean(templateImage));

  return nImage;
};

module.exports = getTrayNativeImageFromPathAsync;
