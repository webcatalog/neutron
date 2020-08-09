/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const tmp = require('tmp');
const builder = require('electron-builder');

const { Arch, Platform } = builder;

const appName = 'Juli';
const DIST_PATH = path.join(__dirname, 'dist');
const APP_PATH = tmp.dirSync().name;
const TEMPLATE_PATH = path.join(DIST_PATH, 'template');

const getDotAppPath = () => {
  if (process.platform === 'darwin') {
    return path.join(APP_PATH, 'mac', `${appName}.app`);
  }
  if (process.platform === 'linux') {
    return path.join(APP_PATH, 'linux-unpacked');
  }
  if (process.platform === 'win32') {
    return path.join(APP_PATH, 'win-unpacked');
  }
  throw Error('Unsupported platform');
};

let targets;
switch (process.platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget(['dir']);
    break;
  }
  case 'win32': {
    targets = Platform.WINDOWS.createTarget(['dir'], Arch.x64);
    break;
  }
  default:
  case 'linux': {
    targets = Platform.LINUX.createTarget(['dir'], Arch.x64);
    break;
  }
}

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
          '!**/*/*.map',
          '!**/*/.DS_Store',
        ],
        asarUnpack: [
          'build/app.json',
          'build/icon.png',
          'build/menubar-icon.png',
          'build/menubar-icon@2x.png',
          'package.json',
        ],
      },
    };

    return builder.build(opts);
  })
  .then(() => {
    // copy all neccessary to unpacked folder
    const dotAppPath = getDotAppPath();
    const resourcesPath = process.platform === 'darwin'
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
        path.join(__dirname, 'node_modules', 'electron', 'dist'),
        path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'dist'),
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
        path.join(__dirname, 'node_modules', 'electron', 'path.txt'),
        path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'path.txt'),
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
