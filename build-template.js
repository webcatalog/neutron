/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const tmp = require('tmp');
const builder = require('electron-builder');
const { exec } = require('child_process');

const packageJson = require('./package.json');

const platform = process.env.TEMPLATE_PLATFORM || process.platform;
const arch = process.env.TEMPLATE_ARCH || 'x64';

if ((['x64', 'arm64'].indexOf(arch) < 0)) {
  console.log(`${platform} ${arch} is not supported`);
}

console.log(`Building for ${platform} ${arch}...`);

const { Arch, Platform } = builder;

const appName = 'Juli';
const DIST_PATH = path.join(__dirname, 'dist');
const APP_PATH = tmp.dirSync().name;
const TEMPLATE_PATH = path.join(DIST_PATH, 'template');

const execAsync = (cmd, opts = {}) => new Promise((resolve, reject) => {
  exec(cmd, opts, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    if (stderr) {
      reject(new Error(stderr));
      return;
    }

    resolve(stdout);
  });
});

// The path/to/package-directroy means the path to the directory that contains your
// .app or .exe, NOT the path to the .app or .exe themselves.
// You can pass multiple paths to sign several packages in one go.
const getPackageDirPath = () => {
  if (platform === 'darwin') {
    if (arch === 'arm64') {
      return path.join(APP_PATH, 'mac-arm64');
    }
    return path.join(APP_PATH, 'mac');
  }
  if (platform === 'linux') {
    if (arch === 'arm64') {
      return path.join(APP_PATH, 'linux-arm64-unpacked');
    }
    return path.join(APP_PATH, 'linux-unpacked');
  }
  if (platform === 'win32') {
    if (arch === 'arm64') {
      return path.join(APP_PATH, 'win-arm64-unpacked');
    }
    return path.join(APP_PATH, 'win-unpacked');
  }
  throw Error('Unsupported platform');
};

const getDotAppPath = () => {
  if (platform === 'darwin') {
    return path.join(getPackageDirPath(), `${appName}.app`);
  }
  return getPackageDirPath();
};

let targets;
switch (platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget(['dir'], Arch[arch]);
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

    const electronVersion = packageJson.devDependencies.electron;
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

    // arm64 is only supported on macOS
    if (arch === 'arm64' && process.platform !== 'darwin') {
      console.log('Packaging using Electron@electron/electron');
    } else {
      console.log('Packaging using Electron@castlabs/electron-releases');
      // use https://github.com/castlabs/electron-releases/releases
      // to support widevinedrm
      // https://github.com/castlabs/electron-releases/issues/70#issuecomment-731360649
      opts.config.electronDownload = {
        version: `${electronVersion}-wvvmp`,
        mirror: 'https://github.com/castlabs/electron-releases/releases/download/v',
      };
    }

    return builder.build(opts);
  })
  // sign with Castlabs EVS
  // https://github.com/castlabs/electron-releases/wiki/EVS
  .then(() => {
    if (process.platform === 'linux' || process.platform === 'win32') return null;
    return Promise.resolve()
      .then(() => {
        const cmd = `python3 -m castlabs_evs.vmp sign-pkg "${getPackageDirPath()}"`;
        console.log('Running:', cmd);
        return execAsync(cmd)
          .then((result) => console.log(result));
      })
      .then(() => {
        // verify
        const cmd = `python3 -m castlabs_evs.vmp verify-pkg "${getPackageDirPath()}"`;
        console.log('Running:', cmd);
        return execAsync(cmd)
          .then((result) => console.log(result));
      });
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

    // signature files for Castlabs EVS
    if (process.platform === 'darwin') {
      tasks.push(fs.copy(
        path.join(dotAppPath, 'Contents', 'Frameworks', 'Electron Framework.framework', 'Versions', 'A', 'Resources', 'Electron Framework.sig'),
        path.join(TEMPLATE_PATH, 'evs', 'Electron Framework.sig'),
      ));
    }

    return Promise.all(tasks);
  })
  .then(() => {
    console.log('successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
