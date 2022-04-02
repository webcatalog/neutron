/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// GitHub API has rate limit
// so we retrieve the latest version using GitHub API
// and push the information to CDN for use
import { Octokit } from 'octokit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const writeVersionToS3Aysnc = async (version: string, s3Path: string) => {
  const s3Client = new S3Client({
    region: 'us-east-2',
  });

  // eslint-disable-next-line no-console
  console.log('Uploading to S3:', s3Path, version);

  const command = new PutObjectCommand({
    Bucket: 'cdn-1.webcatalog.io',
    Key: s3Path,
    Body: Buffer.from(JSON.stringify({ version }), 'utf8'),
    ACL: 'public-read',
    ContentType: 'application/json',
    // without CacheControl header
    // browsers will cache the file using heuristic rule
    // https://webmasters.stackexchange.com/a/53944
    CacheControl: 'public, max-age=0, must-revalidate',
  });
  await s3Client.send(command);

  // eslint-disable-next-line no-console
  console.log('->', `https://cdn-1.webcatalog.io/${s3Path}`);
};

const releaseApiAsync = async () => {
  const octokit = new Octokit();
  const { data: releases } = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'webcatalog',
    repo: 'neutron',
  });

  const stableVersion = releases.filter((release) => release.prerelease === false)[0].tag_name.replace('v', '');
  const betaVersion = releases[0].tag_name.replace('v', '');

  await writeVersionToS3Aysnc(stableVersion, 'neutron/versions/stable.json');
  await writeVersionToS3Aysnc(betaVersion, 'neutron/versions/beta.json');
};

releaseApiAsync()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Sucessful');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });
