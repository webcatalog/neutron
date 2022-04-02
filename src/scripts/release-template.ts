/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import path from 'path';
import fs from 'fs-extra';
import tmp from 'tmp';
import {
  build,
  Arch,
  CliOptions,
  ElectronDownloadOptions,
  Platform,
  archFromString,
} from 'electron-builder';
import { exec } from 'child_process';
import hasha from 'hasha';

import packageJson from '../../package.json';

import ASAR_UNPACK_CONFIG from './constants/asar-unpack-config';

const platform = Platform.fromString(process.env.TEMPLATE_PLATFORM || process.platform);
const archEnv = process.env.TEMPLATE_ARCH || process.arch;

const arch = archFromString(archEnv);

// eslint-disable-next-line no-console
console.log(`Building for ${platform.toString()} ${archEnv}...`);

const appName = 'Juli';
const DIST_PATH = path.join('dist');
const APP_PATH = tmp.dirSync().name;
const TEMPLATE_PATH = path.join(DIST_PATH, 'template');
const zipFileName = `template-${platform}-${archEnv}.zip`;
const TEMPLATE_ZIP_PATH = path.join(DIST_PATH, zipFileName);
const TEMPLATE_JSON_PATH = path.join(DIST_PATH, `template-${platform}-${archEnv}.json`);

// '14.0.0-beta.9' to '14.0.0-beta.9+wvcus'
// '14.0.0' to '14.0.0+wvcus'
const getWvvmpElectronVersion = (electronVersion: string) => `${electronVersion}+wvcus`;

const execAsync = (cmd: string, opts = {}) => new Promise((resolve, reject) => {
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
  if (platform === Platform.MAC) {
    if (arch === Arch.arm64) {
      return path.join(APP_PATH, 'mac-arm64');
    }
    return path.join(APP_PATH, 'mac');
  }
  if (platform === Platform.LINUX) {
    if (arch === Arch.arm64) {
      return path.join(APP_PATH, 'linux-arm64-unpacked');
    }
    return path.join(APP_PATH, 'linux-unpacked');
  }
  if (platform === Platform.WINDOWS) {
    if (arch === Arch.arm64) {
      return path.join(APP_PATH, 'win-arm64-unpacked');
    }
    return path.join(APP_PATH, 'win-unpacked');
  }
  throw Error('Unsupported platform');
};

const getDotAppPath = () => {
  if (platform === Platform.MAC) {
    return path.join(getPackageDirPath(), `${appName}.app`);
  }
  return getPackageDirPath();
};

const targets: Map<Platform, Map<Arch, string[]>> = platform.createTarget(['dir'], arch);

const buildTemplateAsync = async () => {
  await fs.remove(DIST_PATH);
  await fs.ensureDir(DIST_PATH);

  // eslint-disable-next-line no-console
  console.log('Creating Juli app at', APP_PATH);

  const electronVersion = packageJson.devDependencies.electron;
  let electronDownload: ElectronDownloadOptions | null = null;
  // arm64 is only supported on macOS
  if (arch === Arch.arm64 && platform !== Platform.MAC) {
    // eslint-disable-next-line no-console
    console.log('Packaging using Electron@electron/electron');
  } else {
    // eslint-disable-next-line no-console
    console.log('Packaging using Electron@castlabs/electron-releases');
    // use https://github.com/castlabs/electron-releases/releases
    // to support widevinedrm
    // https://github.com/castlabs/electron-releases/issues/70#issuecomment-731360649
    electronDownload = {
      version: getWvvmpElectronVersion(electronVersion),
      mirror: 'https://github.com/castlabs/electron-releases/releases/download/v',
    };
  }

  const opts: CliOptions = {
    targets,
    config: {
      buildDependenciesFromSource: platform === Platform.MAC,
      forceCodeSigning: false,
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
        // binaries
        // we only need to unpack binaries for signing
        // so actually we don't need to unpack them here
        // but we do it anyway so the behaviors
        // of APPX, MAS, standalone, WebCatalog builds are consistent
        ...ASAR_UNPACK_CONFIG,

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
      electronDownload: electronDownload || undefined,
    },
  };

  await build(opts);

  // sign with Castlabs EVS
  // https://github.com/castlabs/electron-releases/wiki/EVS
  if (platform === Platform.MAC) {
    const signPkgCmd = `python3 -m castlabs_evs.vmp sign-pkg "${getPackageDirPath()}"`;
    // eslint-disable-next-line no-console
    console.log('Running:', signPkgCmd);
    const signingResult = await execAsync(signPkgCmd);
    // eslint-disable-next-line no-console
    console.log(signingResult);

    // verify
    const verifyingPkgCmd = `python3 -m castlabs_evs.vmp verify-pkg "${getPackageDirPath()}"`;
    // eslint-disable-next-line no-console
    console.log('Running:', verifyingPkgCmd);
    const verifyingResult = await execAsync(verifyingPkgCmd);
    // eslint-disable-next-line no-console
    console.log(verifyingResult);
  }

  // copy all neccessary to unpacked folder
  const dotAppPath = getDotAppPath();
  const targetName = Array.from(targets)[0][0].name;
  const resourcesPath = targetName === 'mac'
    ? path.join(dotAppPath, 'Contents', 'Resources')
    : path.join(dotAppPath, 'resources');

  const tasks = [
    fs.copy(
      path.resolve('package.json'),
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
      path.resolve('node_modules', 'electron', 'package.json'),
      path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'package.json'),
    ),
    fs.copy(
      path.resolve('node_modules', 'electron', 'index.js'),
      path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'index.js'),
    ),
    fs.copy(
      path.resolve('node_modules', 'electron', 'LICENSE'),
      path.join(TEMPLATE_PATH, 'node_modules', 'electron', 'LICENSE'),
    ),
  ];

  // signature files for Castlabs EVS
  if (platform === Platform.MAC) {
    tasks.push(fs.copy(
      path.join(dotAppPath, 'Contents', 'Frameworks', 'Electron Framework.framework', 'Versions', 'A', 'Resources', 'Electron Framework.sig'),
      path.join(TEMPLATE_PATH, 'evs', 'Electron Framework.sig'),
    ));
  }

  await Promise.all(tasks);
};

const generateTemplateInfoJsonAsync = async () => {
  // eslint-disable-next-line no-console
  console.log(`Generating ${TEMPLATE_JSON_PATH}...`);
  await fs.ensureFile(TEMPLATE_JSON_PATH);
  const sha256 = await hasha.fromFile(TEMPLATE_ZIP_PATH, { algorithm: 'sha256' });
  const { version, minimumWebCatalogVersion } = packageJson;
  await fs.writeJSON(TEMPLATE_JSON_PATH, {
    version,
    minimumWebCatalogVersion,
    sha256,
    zipFileName,
    downloadUrl: `https://github.com/webcatalog/neutron/releases/download/v${version}/${zipFileName}`,
  });
};

const zipTemplateAsync = async () => {
  // eslint-disable-next-line no-console
  console.log(`Zipping ${TEMPLATE_PATH} -> ${TEMPLATE_ZIP_PATH}...`);
  const zipCmd = `7z a -mm=Deflate -mx=9 -r ${TEMPLATE_ZIP_PATH} ${TEMPLATE_PATH}`;
  const zipResults = await execAsync(zipCmd);
  // eslint-disable-next-line no-console
  console.log(zipResults);
};

Promise.resolve()
  .then(async () => {
    await buildTemplateAsync();
    await zipTemplateAsync();
    await generateTemplateInfoJsonAsync();

    // eslint-disable-next-line no-console
    console.log('successful');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });
