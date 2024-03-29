/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  Arch,
  CliOptions,
  Platform,
  PlatformSpecificBuildOptions,
  build,
} from 'electron-builder';
import path from 'path';
import fs from 'fs-extra';

import ASAR_UNPACK_CONFIG from './constants/asar-unpack-config';

if (!process.env.APP_ID) {
  // eslint-disable-next-line no-console
  console.log('APP_ID env is not defined.');
  process.exit(1);
}

Promise.resolve()
  .then(async () => {
    const appId = process.env.APP_ID as 'singlebox' | 'singlebox-plus' | 'clovery' | 'skywhale';

    const buildResourcesPath = path.resolve('build-resources-mac-app-store', appId);
    const configJson = await fs.readJSON(path.join(buildResourcesPath, 'config.json'));

    // eslint-disable-next-line no-console
    console.log(`Machine: ${process.platform}`);

    const packageJsonPath = path.resolve('package.json');
    const packageJsonContent = await fs.readJSON(packageJsonPath);

    const appVersion = packageJsonContent.version as string;

    let targets;
    switch (Platform.fromString(process.platform)) {
      case Platform.MAC: {
        targets = Platform.MAC.createTarget([process.env.FORCE_DEV ? 'mas-dev' : 'mas'], Arch.universal);
        break;
      }
      default: {
        // eslint-disable-next-line no-console
        console.log('Platform is not supported');
        process.exit(1);
      }
    }

    packageJsonContent.productName = configJson.productName;
    packageJsonContent.description = configJson.productDescription;
    await fs.writeJSON(packageJsonPath, packageJsonContent, { spaces: '  ' });

    const protocols = [
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
      {
        name: 'Webcal Protocol',
        schemes: ['webcal'],
      },
    ];

    const opts: CliOptions = {
      targets,
      publish: 'always',
      config: {
        // build from source to build keytar as universal binary
        // https://github.com/webcatalog/neutron/pull/620
        buildDependenciesFromSource: true,
        asarUnpack: ASAR_UNPACK_CONFIG as PlatformSpecificBuildOptions['asarUnpack'],
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
          buildResources: 'build-resources-mas',
        },
        protocols,
        mac: {
          darkModeSupport: true,
          // https://github.com/electron/electron/issues/15958#issuecomment-447685065
          // alternative solution for app.requestSingleInstanceLock
          // in signed mas builds (Mac App Store)
          extendInfo: {
            LSMultipleInstancesProhibited: true,
            NSCameraUsageDescription: `The websites you are running may access your camera. ${configJson.productName} itself does not utilize your camera by any means.`,
            NSMicrophoneUsageDescription: `The websites you are running may access your microphone. ${configJson.productName} itself does not utilize your microphone by any means.`,
          },
          entitlementsLoginHelper: 'build-resources-mas/entitlements.mas.login-helper.plist',
        },
        mas: {
          category: 'public.app-category.productivity',
          provisioningProfile: process.env.FORCE_DEV
            ? 'build-resources-mas/embedded-development.provisionprofile' // mas-dev
            : 'build-resources-mas/embedded.provisionprofile',
          darkModeSupport: true,
        },
        // we can't remove unused *.lproj dir because
        // it would cause navigator.language & navigator.languages to always return 'en-US'
        // https://github.com/electron/electron/issues/2484
        publish: [
          {
            provider: 's3',
            channel: 'latest',
            bucket: 'cdn-2.webcatalog.io',
            region: 'us-east-2',
            path: `/${appId}-mac-app-store`,
          },
        ],
      },
    };

    const filesToBeReplaced = await fs.readdir(path.join(buildResourcesPath, 'build'));

    const p = filesToBeReplaced.map((fileName) => fs.copyFile(
      path.join(buildResourcesPath, 'build', fileName),
      path.resolve('build', fileName),
    ));
    await Promise.all(p);

    await build(opts);
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
