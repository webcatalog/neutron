/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const tmp = require('tmp');
const builder = require('electron-builder');

const platform = process.env.TEMPLATE_PLATFORM || process.platform;
const arch = process.env.TEMPLATE_ARCH || 'x64';

if ((['x64', 'arm64'].indexOf(arch) < 0) || (platform !== 'linux' && arch !== 'x64')) {
  console.log(`${platform} ${arch} is not supported`);
}

console.log(`Building for ${platform} ${arch}...`);

const { Arch, Platform } = builder;

const appName = 'Juli';
const DIST_PATH = path.join(__dirname, 'dist');
const APP_PATH = tmp.dirSync().name;
const TEMPLATE_PATH = path.join(DIST_PATH, 'template');

const getDotAppPath = () => {
  if (platform === 'darwin') {
    return path.join(APP_PATH, 'mac', `${appName}.app`);
  }
  if (platform === 'linux') {
    if (arch === 'arm64') {
      return path.join(APP_PATH, 'linux-arm64-unpacked');
    }
    return path.join(APP_PATH, 'linux-unpacked');
  }
  if (platform === 'win32') {
    return path.join(APP_PATH, 'win-unpacked');
  }
  throw Error('Unsupported platform');
};

let targets;
switch (platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget(['dir']);
    break;
  }
  case 'win32': {
    targets = Platform.WINDOWS.createTarget(['dir'], Arch[arch]);
    break;
  }
  default:
  case 'linux': {
    targets = Platform.LINUX.createTarget(['dir'], Arch[arch]);
    break;
  }
}

console.log(targets);

Promise.resolve()
  .then(() => fs.remove(DIST_PATH))
  .then(() => fs.ensureDir(DIST_PATH))
  .then(() => {
    console.log('Creating Juli app at', APP_PATH);

    const opts = {
      targets,
      config: {
        directories: {
          output: APP_PATH,
        },
        productName: appName,
        appId: 'com.webcatalog.juli',
        files: [
          '!docs/**/*',
          '!template/**/*',
          '!patches/**/*',
          '!template*.zip',
          '!template*.json',
          // heavy demo files
          '!node_modules/image-q/demo/**/*',
          // other files
          '!**/*/*.ts',
          '!node_modules/*/*.map',
          '!**/*/.DS_Store',
        ],
        asarUnpack: [
          'build/app.json',
          'build/icon.png',
          'build/menubar-icon.png',
          'build/menubar-icon@2x.png',
          'build/dock-icon.png',
          'build/dock-icon@2x.png',
          'build/dock-icon@3x.png',
          'build/dock-icon@4x.png',
          'build/dock-icon@5x.png',
          'package.json',
        ],
      },
    };

    return builder.build(opts);
  })
  .then(() => {
    // copy all neccessary to unpacked folder
    const dotAppPath = getDotAppPath();
    const targetName = Array.from(targets)[0][0].name;
    const resourcesPath = targetName === 'mac'
      ? path.join(dotAppPath, 'Contents', 'Resources')
      : path.join(dotAppPath, 'resources');

    const tasks = [
      fs.copy(
        path.join(__dirname, 'package.json'),
        path.join(TEMPLATE_PATH, 'package.json'),
      ),
      fs.move(
        path.join(resourcesPath, 'app.asar'),
        path.join(TEMPLATE_PATH, 'app.asar'),
      ),
      fs.move(
        path.join(resourcesPath, 'app.asar.unpacked'),
        path.join(TEMPLATE_PATH, 'app.asar.unpacked'),
      ),
      fs.copy(
        path.join(__dirname, 'node_modules', 'electron', 'package.json'),
        path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'package.json'),
      ),
      fs.copy(
        path.join(__dirname, 'node_modules', 'electron', 'index.js'),
        path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'index.js'),
      ),
      fs.copy(
        path.join(__dirname, 'node_modules', 'electron', 'LICENSE'),
        path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'LICENSE'),
      ),
    ];

    return Promise.all(tasks);
  })
  .then(() => {
    console.log('successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
