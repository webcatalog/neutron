/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  Arch,
  CliOptions,
  ElectronDownloadOptions,
  Platform,
  build,
} from 'electron-builder';
import path from 'path';
import fs from 'fs-extra';
import { notarize } from 'electron-notarize';
import { exec } from 'child_process';

import signEvsAsync from './helpers/sign-evs-async';
import getCastlabsElectronVersion from './helpers/get-castlabs-electron-version';

const appId = process.env.APP_ID as 'singlebox' | 'clovery' | 'skywhale';

// sometimes, notarization works but *.app does not have a ticket stapled to it
// this ensure the *.app has the notarization ticket
const verifyNotarizationAsync = (filePath: string) => new Promise((resolve, reject) => {
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

const buildAsync = async (
  platform: Platform,
  targetTypes: string[],
  ...archs: Arch[]
) => {
  const buildResourcesPath = path.resolve('build-resources-standalone', appId);
  const configJson = await fs.readJSON(path.join(buildResourcesPath, 'config.json'));

  // run each signing task at once
  let codeSigningPromise = Promise.resolve();
  const hsmCodeSignAsync = (filePath: string) => {
    codeSigningPromise = codeSigningPromise
      .then(() => new Promise((resolve, reject) => {
        const {
          AZURE_KEY_VAULT_TENANT_ID,
          AZURE_KEY_VAULT_CLIENT_ID,
          AZURE_KEY_VAULT_CLIENT_SECRET,
          AZURE_KEY_VAULT_URI,
          AZURE_KEY_VAULT_CERT_NAME,
        } = process.env;

        // eslint-disable-next-line no-console
        console.log('Signing', filePath);
        const command = `azuresigntool sign -kvu ${AZURE_KEY_VAULT_URI} -kvc ${AZURE_KEY_VAULT_CERT_NAME} -kvt ${AZURE_KEY_VAULT_TENANT_ID} -kvi ${AZURE_KEY_VAULT_CLIENT_ID} -kvs ${AZURE_KEY_VAULT_CLIENT_SECRET} -tr http://rfc3161timestamp.globalsign.com/advanced -td sha256 '${filePath}'`;
        exec(command, { shell: 'powershell.exe' }, (e, stdout, stderr) => {
          if (e instanceof Error) {
            // eslint-disable-next-line no-console
            console.log(e);
            reject(e);
            return;
          }

          if (stderr) {
            reject(new Error(stderr));
            return;
          }

          if (stdout.indexOf('Signing completed successfully') > -1) {
            // eslint-disable-next-line no-console
            console.log(stdout);
            resolve();
          } else {
            reject(new Error(stdout));
          }
        });
      }));
    return codeSigningPromise;
  };

  const packageJsonPath = path.join('package.json');
  const packageJsonContent = await fs.readJSON(packageJsonPath);

  const appVersion: string = packageJsonContent.version;

  packageJsonContent.name = configJson.productName;
  packageJsonContent.description = configJson.productDescription;
  await fs.writeJSON(packageJsonPath, packageJsonContent, { spaces: '  ' });

  const protocols = [];
  if (configJson.setAsDefaultBrowser) {
    protocols.push({
      name: 'HTTPS Protocol',
      schemes: ['https'],
    });
    protocols.push({
      name: 'HTTP Protocol',
      schemes: ['http'],
    });
  }
  if (configJson.setAsDefaultEmailClient) {
    protocols.push({
      name: 'Mailto Protocol',
      schemes: ['mailto'],
    });
  }
  if (configJson.setAsDefaultCalendarApp) {
    protocols.push({
      name: 'Webcal Protocol',
      schemes: ['webcal'],
    });
  }

  const electronVersion = packageJsonContent.devDependencies.electron as string;
  let electronDownload: ElectronDownloadOptions | null = null;
  // Windows/Linux arm64 is not supported by Widevine DRM
  const widevineSupported = platform === Platform.LINUX && archs.includes(Arch.arm64);
  if (widevineSupported) {
    // eslint-disable-next-line no-console
    console.log('Packaging using Electron@electron/electron');
  } else {
    // eslint-disable-next-line no-console
    console.log('Packaging using Electron@castlabs/electron-releases');
    // use https://github.com/castlabs/electron-releases/releases
    // to support widevinedrm
    // https://github.com/castlabs/electron-releases/issues/70#issuecomment-731360649
    electronDownload = {
      version: getCastlabsElectronVersion(electronVersion),
      mirror: 'https://github.com/castlabs/electron-releases/releases/download/v',
    };
  }

  const opts: CliOptions = {
    targets: platform.createTarget(targetTypes, ...archs),
    config: {
      // build from source to build keytar as universal binary
      // https://github.com/webcatalog/neutron/pull/620
      buildDependenciesFromSource: process.platform === 'darwin',
      asarUnpack: [
        'node_modules/node-mac-permissions/build',
        'node_modules/keytar/build',
        'node_modules/better-sqlite3/build',
      ],
      appId: configJson.productId,
      // https://github.com/electron-userland/electron-builder/issues/3730
      buildVersion: process.platform === 'darwin' ? appVersion : undefined,
      productName: configJson.productName,
      files: [
        '!docs/**/*',
        '!popclip/**/*',
        '!test/**/*',
      ],
      directories: {
        buildResources: 'build-resources',
      },
      electronDownload: electronDownload || undefined,
      protocols,
      publish: [
        {
          provider: 'generic',
          channel: 'latest',
          url: `https://cdn-2.webcatalog.io/${configJson.internalId}`,
          useMultipleRangeRequest: true,
        },
        {
          provider: 's3',
          channel: 'latest',
          bucket: 'cdn-2.webcatalog.io',
          region: 'us-east-2',
          path: `/${configJson.internalId}`,
        },
      ],
      mac: {
        // https://github.com/electron/electron/issues/19307#issuecomment-524314643
        extendInfo: {
          NSCameraUsageDescription: `The websites you are running request to access your camera. ${configJson.productName} itself does not utilize your camera by any means.`,
          NSMicrophoneUsageDescription: `The websites you are running request to access your microphone. ${configJson.productName} itself does not utilize your microphone by any means.`,
        },
      },
      win: {
        // https://www.electron.build/configuration/win.html#how-do-delegate-code-signing
        sign: (configuration) => hsmCodeSignAsync(configuration.path),
      },
      afterPack: async (context) => {
        // pre-generated .sig files that exist in the app
        // bundle prevents @electron/universal from working correctly with castlab-electron
        // so we remove it, EVS will re-generate the file
        // https://github.com/castlabs/electron-releases/issues/105#issuecomment-905087389
        if (context.electronPlatformName === 'darwin' && widevineSupported && context.arch !== Arch.universal) {
          const { appOutDir } = context;
          const appName = context.packager.appInfo.productFilename;
          await fs.unlink(`${appOutDir}/${appName}.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/Electron Framework.sig`);
        }

        if (context.electronPlatformName === 'darwin' && context.arch === Arch.arm64) {
          // fix https://github.com/castlabs/electron-releases/issues/111
          const { appOutDir } = context;
          const appName = context.packager.appInfo.productFilename;
          const arm64MainMenuLibPath = `${appOutDir}/${appName}.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/MainMenu.nib`;
          const x64MainMenuLibPath = arm64MainMenuLibPath.replace('mac-universal--arm64', 'mac-universal--x64');
          await fs.copy(x64MainMenuLibPath, arm64MainMenuLibPath);
        }

        // sign with Castlabs EVS
        // https://github.com/castlabs/electron-releases/wiki/EVS
        // for macOS, run this before signing
        // eslint-disable-next-line react/destructuring-assignment
        if (context.electronPlatformName === 'darwin' && context.arch === Arch.universal) {
          return signEvsAsync(context.appOutDir);
        }
        return null;
      },
      afterSign: async (context) => {
        // sign with Castlabs EVS
        // https://github.com/castlabs/electron-releases/wiki/EVS
        // for Windows (x64 only), run this after signing
        if (context.electronPlatformName === 'win32' && context.arch !== Arch.arm64) {
          await signEvsAsync(context.appOutDir);
        }

        if (platform === Platform.MAC) {
          // eslint-disable-next-line no-console
          console.log('Notarizing app...');
          // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
          const { appOutDir } = context;

          const appName = context.packager.appInfo.productFilename;
          const appPath = `${appOutDir}/${appName}.app`;

          await notarize({
            appBundleId: configJson.productId,
            appPath,
            appleId: process.env.APPLE_ID!,
            appleIdPassword: process.env.APPLE_ID_PASSWORD!,
          });

          const notarizedInfo = await verifyNotarizationAsync(appPath);
          // eslint-disable-next-line no-console
          console.log(notarizedInfo);
        }
      },
    },
  };

  const filesToBeReplaced = await fs.readdir(path.join(buildResourcesPath, 'build'));

  const p = filesToBeReplaced.map((fileName) => fs.copyFile(
    path.join(buildResourcesPath, 'build', fileName),
    path.join(__dirname, 'build', fileName),
  ));
  await Promise.all(p);

  await build(opts);
};

Promise.resolve()
  .then(async () => {
    const platform = Platform.fromString(process.platform);

    switch (platform) {
      case Platform.MAC: {
        // use Arch.universal because
        // electron-updater 4.3.10 -> 4.5.1 has a bug preventing
        // Intel-based Macs from updating if there exists Arch.arm64 builds
        // https://github.com/electron-userland/electron-builder/pull/6212
        // eslint-disable-next-line no-console
        console.log(`Building ${platform.toString()} (universal)`);
        await buildAsync(platform, ['zip', 'dmg'], Arch.universal);
        break;
      }
      case Platform.WINDOWS: {
        // eslint-disable-next-line no-console
        console.log(`Building ${platform.toString()} (universal)`);
        await buildAsync(platform, ['nsis'], Arch.x64, Arch.arm64);
        break;
      }
      case Platform.LINUX: {
        // eslint-disable-next-line no-console
        console.log(`Building ${platform.toString()} (x64)`);
        await buildAsync(platform, ['AppImage', 'tar.gz', 'snap'], Arch.x64);
        // eslint-disable-next-line no-console
        console.log(`Building ${platform.toString()} (arm64)`);
        await buildAsync(platform, ['AppImage', 'tar.gz'], Arch.arm64);
        break;
      }
      default: {
        // eslint-disable-next-line no-console
        console.log('Platform is not supported');
        process.exit(1);
      }
    }
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('build successful');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });
