/* eslint-disable header/header */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const builder = require('electron-builder');
const path = require('path');
const fs = require('fs-extra');

const packageJson = require('./package.json');

const appId = process.env.APP_ID;

if (!appId) {
  console.log('APP_ID env is not defined.');
  process.exit(1);
}

const buildResourcesPath = path.join(__dirname, 'build-resources-appx', appId);

const configJson = fs.readJSONSync(path.join(buildResourcesPath, 'config.json'));

const { Arch, Platform } = builder;

console.log(`Machine: ${process.platform}`);

const appVersion = packageJson.version;

let targets;
switch (process.platform) {
  case 'win32': {
    targets = Platform.WINDOWS.createTarget(['appx'], Arch.x64, Arch.arm64);
    break;
  }
  default: {
    console.log('Platform is not supported');
    process.exit(1);
  }
}

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJsonContent = fs.readJSONSync(packageJsonPath);
packageJsonContent.name = configJson.productName;
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

const opts = {
  targets,
  publish: 'always',
  config: {
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
  .then(() => builder.build(opts))
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
