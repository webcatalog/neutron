/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  build, Arch, Platform, CliOptions, PlatformSpecificBuildOptions,
} from 'electron-builder';
import path from 'path';
import fs from 'fs-extra';

import ASAR_UNPACK_CONFIG from './constants/asar-unpack-config';

if (!process.env.APP_ID) {
  // eslint-disable-next-line no-console
  console.log('APP_ID env is not defined.');
  process.exit(1);
}

const appId = process.env.APP_ID as 'singlebox' | 'clovery';

const buildResourcesPath = path.resolve('build-resources-appx', appId);

const configJson = fs.readJSONSync(path.join(buildResourcesPath, 'config.json'));

const platform = Platform.fromString(process.platform);

// eslint-disable-next-line no-console
console.log(`Machine: ${platform.toString()}`);

let targets;
switch (platform) {
  case Platform.WINDOWS: {
    targets = Platform.WINDOWS.createTarget(['appx'], Arch.x64, Arch.arm64);
    break;
  }
  default: {
    // eslint-disable-next-line no-console
    console.log('Platform is not supported');
    process.exit(1);
  }
}

const packageJsonPath = path.join('package.json');
const packageJsonContent = fs.readJSONSync(packageJsonPath);
packageJsonContent.productName = configJson.productName;
fs.writeJSONSync(packageJsonPath, packageJsonContent, { spaces: '  ' });

const protocols = [];
protocols.push({
  name: 'HTTPS Protocol',
  schemes: ['https'],
});
protocols.push({
  name: 'HTTP Protocol',
  schemes: ['http'],
});
protocols.push({
  name: 'Mailto Protocol',
  schemes: ['mailto'],
});
protocols.push({
  name: 'Webcal Protocol',
  schemes: ['webcal'],
});

const opts: CliOptions = {
  targets,
  publish: 'always',
  config: {
    asarUnpack: ASAR_UNPACK_CONFIG as PlatformSpecificBuildOptions['asarUnpack'],
    appId: configJson.productId,
    productName: configJson.productName,
    files: [
      '!docs/**/*',
      '!popclip/**/*',
      '!test/**/*',
    ],
    directories: {
      buildResources: 'build-resources-appx',
    },
    protocols,
    appx: {
      identityName: configJson.identityName,
      publisher: configJson.publisher,
      backgroundColor: configJson.backgroundColor,
      languages: ['en'],
      showNameOnTiles: true,
    },
    publish: [
      {
        provider: 's3',
        channel: 'latest',
        bucket: 'cdn-2.webcatalog.io',
        region: 'us-east-2',
        path: `/${appId}-appx`,
      },
    ],
  },
};

Promise.resolve()
  .then(() => {
    const filesToBeReplaced = fs.readdirSync(path.join(buildResourcesPath, 'build'));

    const p = filesToBeReplaced.map((fileName) => fs.copyFile(
      path.join(buildResourcesPath, 'build', fileName),
      path.join(__dirname, 'build', fileName),
    ));
    return Promise.all(p);
  })
  .then(() => build(opts))
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('build successful');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });
