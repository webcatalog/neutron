/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const packager = require('electron-packager');
const tmp = require('tmp');

const appName = 'Juli';
const DIST_PATH = path.join(__dirname, 'dist');
const APP_PATH = tmp.dirSync().name;
const TEMPLATE_PATH = path.join(DIST_PATH, 'template');

const getDotAppPath = () => {
  if (process.platform === 'darwin') {
    return path.join(APP_PATH, `${appName}-darwin-x64`, `${appName}.app`);
  }
  if (process.platform === 'linux') {
    return path.join(APP_PATH, `${appName}-linux-x64`);
  }
  if (process.platform === 'win32') {
    return path.join(APP_PATH, `${appName}-win32-x64`);
  }
  throw Error('Unsupported platform');
};

Promise.resolve()
  .then(() => fs.remove(DIST_PATH))
  .then(() => fs.ensureDir(DIST_PATH))
  .then(() => {
    console.log('Creating Juli app at', APP_PATH);

    const asarUnpackedFiles = ['app.json', 'icon.png', 'icon.ico', 'package.json'];

    const opts = {
      name: appName,
      appBundleId: 'com.webcatalog.juli',
      platform: process.platform,
      dir: path.resolve(__dirname),
      out: APP_PATH,
      overwrite: true,
      prune: true,
      osxSign: false,
      darwinDarkModeSupport: true,
      tmpdir: false,
      ignore: [
        '.*\\.cc$',
        '.*\\.cpp$',
        '.*\\.csproj$',
        '.*\\.cxx$',
        '.*\\.h$',
        '.*\\.hprof$',
        '.*\\.hxx$',
        '.*\\.iml$',
        '.*\\.map$',
        '.*\\.md$',
        '.*\\.mm$',
        '.*\\.o$',
        '.*\\.orig$',
        '.*\\.pyc$',
        '.*\\.pyo$',
        '.*\\.rbc$',
        '.*\\.sln$',
        '.*\\.sublime-workspace$',
        '.*\\.swp$',
        '.*\\.ts$',
        '.*\\.txt$',
        '.*\\.xproj$',
        '.*\\.yml$',
        '\\.DS_Store$',
        '\\._.*$',
        '\\.babelrc$',
        '\\.editorconfig$',
        '\\.eslintrc$',
        '\\.flowconfig$',
        '\\.git$',
        '\\.gitattributes$',
        '\\.github$',
        '\\.gitignore$',
        '\\.hg$',
        '\\.idea$',
        '\\.jshintrc$',
        '\\.npmignore$',
        '\\.nyc_output$',
        '\\.svn$',
        '\\.vs$',
        '\\.yarn-integrity$',
        '\\.yarn-metadata\\.json',
        'CVS',
        'LICENSE',
        'RCS',
        'README',
        'README\\..*',
        'SCCS',
        '__pycache__',
        '__tests__',
        'example',
        'examples',
        'license',
        'npm-debug\\.log',
        'patches',
        'powered-test',
        'readme',
        'readme\\..*',
        'test',
        'tests',
        'thumbs\\.db',
        'yarn\\.lock',
        'node_modules/\\.bin',
        'node_modules/\\.cache',
        'node_modules/image-q/demo',

        '^/dist',
        '^/patches',
        '^/public',
        '^/src',
        '^/template.*\\.json',
        '^/template.*\\.zip',
        'docs',
      ],
      asar: {
        unpack: `{${asarUnpackedFiles.join(',')}}`,
      },
    };

    return packager(opts);
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
        path.join(__dirname, 'node_modules', 'electron'),
        path.join(TEMPLATE_PATH, 'node_modules', 'electron'),
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
