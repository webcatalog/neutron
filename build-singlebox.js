/* eslint-disable no-console */
const builder = require('electron-builder');
const { notarize } = require('electron-notarize');
const semver = require('semver');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const packageJson = require('./package.json');

const { Arch, Platform } = builder;

const BUILD_RESOURCES_DIR_NAME = 'build-resources-singlebox';

// sometimes, notarization works but *.app does not have a ticket stapled to it
// this ensure the *.app has the notarization ticket
const verifyNotarizationAsync = (filePath) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-console
  console.log(`xcrun stapler validate ${filePath.replace(/ /g, '\\ ')}`);

  exec(`xcrun stapler validate ${filePath.replace(/ /g, '\\ ')}`, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    if (stderr) {
      reject(new Error(stderr));
      return;
    }

    if (stdout.indexOf('The validate action worked!') > -1) {
      resolve(stdout);
    } else {
      reject(new Error(stdout));
    }
  });
});

console.log(`Machine: ${process.platform}`);

let targets;
switch (process.platform) {
  case 'darwin': {
    targets = Platform.MAC.createTarget();
    break;
  }
  case 'win32': {
    targets = Platform.WINDOWS.createTarget(['nsis'], Arch.x64);
    break;
  }
  default:
  case 'linux': {
    targets = Platform.LINUX.createTarget(['AppImage', 'snap'], Arch.x64);
    break;
  }
}

const filesToBeReplaced = fs.readdirSync(path.join(__dirname, 'build-resources-singlebox', 'build'));

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJsonContent = fs.readJSONSync(packageJsonPath);
packageJsonContent.name = 'Singlebox';
fs.writeJSONSync(packageJsonPath, packageJsonContent, { spaces: '  ' });

const opts = {
  targets,
  config: {
    appId: 'com.singlebox.app',
    productName: 'Singlebox',
    asar: true,
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
    asarUnpack: filesToBeReplaced.map((fileName) => path.join('build', fileName)),
    publish: [
      {
        provider: 'github',
        owner: 'atomery',
        repo: 'singlebox',
      },
    ],
    protocols: [
      {
        name: 'HTTPS Protocol',
        schemes: ['https'],
      },
      {
        name: 'HTTP Protocol',
        schemes: ['http'],
      },
      {
        name: 'Mailto Protocol',
        schemes: ['mailto'],
      },
    ],
    directories: {
      buildResources: BUILD_RESOURCES_DIR_NAME,
    },
    mac: {
      category: 'public.app-category.productivity',
      hardenedRuntime: true,
      gatekeeperAssess: false,
      entitlements: path.join(BUILD_RESOURCES_DIR_NAME, 'entitlements.mac.plist'),
      entitlementsInherit: path.join(BUILD_RESOURCES_DIR_NAME, 'entitlements.mac.plist'),
      darkModeSupport: true,
    },
    linux: {
      category: 'Utility',
      packageCategory: 'utils',
    },
    snap: {
      publish: [
        {
          provider: 'snapStore',
          channels: [semver.prerelease(packageJson.version) ? 'edge' : 'stable'],
        },
        {
          provider: 'github',
          owner: 'atomery',
          repo: 'singlebox',
        },
      ],
    },
    afterPack: (context) => {
      console.log('Running afterPack hook....');
      const buildResourcesPath = path.join(__dirname, BUILD_RESOURCES_DIR_NAME);
      const resourcesDirPath = context.electronPlatformName === 'darwin'
        ? path.join(context.appOutDir, 'Singlebox.app', 'Contents', 'Resources')
        : path.join(context.appOutDir, 'resources');
      const asarUnpackedDirPath = path.join(resourcesDirPath, 'app.asar.unpacked');
      return Promise.resolve()
        .then(() => {
          const p = filesToBeReplaced.map((fileName) => fs.copyFile(
            path.join(buildResourcesPath, 'build', fileName),
            path.join(asarUnpackedDirPath, 'build', fileName),
          ));
          return Promise.all(p);
        })
        .then(() => {
          console.log('Configured Singlebox successfully.');
        });
    },
    afterSign: (context) => {
      const shouldNotarize = process.platform === 'darwin' && context.electronPlatformName === 'darwin' && process.env.CI_BUILD_TAG;
      if (!shouldNotarize) return null;

      console.log('Notarizing app...');
      // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
      const { appOutDir } = context;

      const appName = context.packager.appInfo.productFilename;
      const appPath = `${appOutDir}/${appName}.app`;

      return notarize({
        appBundleId: 'com.singlebox.app',
        appPath,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
      })
        .then(() => verifyNotarizationAsync(appPath))
        .then((notarizedInfo) => {
          // eslint-disable-next-line no-console
          console.log(notarizedInfo);
        });
    },
  },
};

builder.build(opts)
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
