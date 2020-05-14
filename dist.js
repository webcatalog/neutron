/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const hasha = require('hasha');

const packageJson = require('./package.json');

const name = `template-${process.platform}-x64.zip`;
const TEMPLATE_ZIP_PATH = path.resolve(__dirname, name);
const TEMPLATE_JSON_PATH = path.resolve(__dirname, `template-${process.platform}-x64.json`);

Promise.resolve()
  .then(() => {
    if (!fs.existsSync(TEMPLATE_ZIP_PATH)) {
      console.log(`Preparing ${TEMPLATE_ZIP_PATH}...`);
      return fs.move(path.resolve(__dirname, 'template.zip'), TEMPLATE_ZIP_PATH);
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
      name,
      downloadUrl: `https://github.com/atomery/juli/releases/download/v${version}/${name}`,
    });
  })
  .then(() => {
    console.log('successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
