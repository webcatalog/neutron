/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { app } from '@electron/remote';

import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';

import getStaticGlobal from '../../../helpers/get-static-global';
import isStandalone from '../../../helpers/is-standalone';
import isMas from '../../../helpers/is-mas';
import isAppx from '../../../helpers/is-appx';

import cloveryIconPng from '../../../images/products/clovery-mac-icon-128@2x.png';
import singleboxIconPng from '../../../images/products/singlebox-mac-icon-128@2x.png';

import {
  requestOpenInBrowser,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 64,
    width: 64,
    marginRight: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(1),
  },
  version: {
    marginBottom: theme.spacing(2),
  },
  versionSmallContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  versionSmall: {
    fontSize: '0.8rem',
  },
  content: {
    flex: 1,
  },
}));

const About = () => {
  const classes = useStyles();

  const appJson = getStaticGlobal('appJson');
  const appVersion = app.getVersion();

  const versions = [
    { name: 'Neutron', version: appVersion },
    { name: 'Electron', version: window.process.versions.electron },
    { name: 'Node', version: window.process.versions.node },
    { name: 'Chromium', version: window.process.versions.chrome },
  ];

  let buildSource = 'WebCatalog';
  if (isMas()) buildSource = 'Mac App Store';
  else if (isAppx()) buildSource = 'Microsoft Store';
  else if (isStandalone()) buildSource = 'Standalone';

  return (
    <ListItem>
      <div className={classes.content}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box>
            <img
              src={(() => {
                if (appJson.id === 'clovery') return cloveryIconPng;
                if (appJson.id === 'singlebox' || appJson.id === 'singlebox-plus') return singleboxIconPng;
                return `file://${window.iconPath}`;
              })()}
              alt={appJson.name}
              className={classes.icon}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="h6" className={classes.title}>{appJson.name}</Typography>
            <Typography
              variant="body2"
            >
              {`Version ${appVersion} (${buildSource}, ${window.process.arch})`}
            </Typography>
            <Typography
              variant="body2"
              className={classes.version}
            >
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const changelogUrl = appJson.changelogUrl || 'https://webcatalog.io/webcatalog/changelog/neutron/';
                  requestOpenInBrowser(changelogUrl);
                }}
              >
                (What&apos;s New)
              </Link>
            </Typography>
          </Box>
          <Box>
            <div className={classes.versionSmallContainer}>
              {versions.map(({ name, version }) => (
                <Typography key={name} variant="body2" className={classes.versionSmall}>
                  {name}
                  :
                  {' '}
                  {version}
                </Typography>
              ))}
            </div>
          </Box>
        </Box>
      </div>
    </ListItem>
  );
};

export default About;
