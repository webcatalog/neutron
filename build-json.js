/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const hasha = require('hasha');

const packageJson = require('./package.json');

const zipFileName = `template-${process.platform}-x64.zip`;
const DIST_PATH = path.join(__dirname, 'dist');
const TEMPLATE_ZIP_PATH = path.join(DIST_PATH, zipFileName);
const TEMPLATE_JSON_PATH = path.join(DIST_PATH, `template-${process.platform}-x64.json`);

Promise.resolve()
  .then(() => {
    if (!fs.existsSync(TEMPLATE_ZIP_PATH)) {
      console.log(`Preparing ${TEMPLATE_ZIP_PATH}...`);
      return fs.move(path.resolve(DIST_PATH, 'template.zip'), TEMPLATE_ZIP_PATH);
    }
    return null;
  })
  .then(async () => {
    console.log(`Generating ${TEMPLATE_JSON_PATH}...`);
    fs.ensureFileSync(TEMPLATE_JSON_PATH);
    const sha256 = await hasha.fromFile(TEMPLATE_ZIP_PATH, { algorithm: 'sha256' });
    const { version, minimumWebCatalogVersion } = packageJson;
    fs.writeJSONSync(TEMPLATE_JSON_PATH, {
      version,
      minimumWebCatalogVersion,
      sha256,
      zipFileName,
      downloadUrl: `https://github.com/atomery/juli/releases/download/v${version}/${zipFileName}`,
    });
  })
  .then(() => {
    console.log('successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
