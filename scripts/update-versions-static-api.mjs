/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// GitHub API has rate limit
// so we retrieve the latest version using GitHub API
// and push the information to CDN for use
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const writeObjectToS3Aysnc = async (obj, s3Path) => {
  const s3Client = new S3Client({
    region: 'us-east-2',
  });

  // eslint-disable-next-line no-console
  console.log('Uploading to S3:', s3Path, obj);

  const command = new PutObjectCommand({
    Bucket: 'cdn-1.webcatalog.io',
    Key: s3Path,
    Body: Buffer.from(JSON.stringify(obj), 'utf8'),
    ACL: 'public-read',
    ContentType: 'application/json',
    // without CacheControl header
    // browsers will cache the file using heuristic rule
    // https://webmasters.stackexchange.com/a/53944
    CacheControl: 'public, max-age=0, must-revalidate',
  });
  await s3Client.send(command);
};

const updateVersionStaticApi = async () => {
  const releases = await fetch('https://api.github.com/repos/webcatalog/neutron/releases')
    .then((res) => res.json());

  const stableVersion = releases.filter((release) => release.prerelease === false)[0].tag_name.replace('v', '');
  const betaVersion = releases[0].tag_name.replace('v', '');

  await writeObjectToS3Aysnc({ version: stableVersion }, 'neutron/versions/stable.json');
  await writeObjectToS3Aysnc({ version: betaVersion }, 'neutron/versions/beta.json');
};

try {
  await updateVersionStaticApi();
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(err);
  process.exit(1);
}
