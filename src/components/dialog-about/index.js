/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';

import { requestOpenInBrowser } from '../../senders';

import singleboxIconPng from '../../images/products/singlebox-mac-icon-128@2x.png';

const styles = (theme) => ({
  icon: {
    height: 96,
    width: 96,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
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
  goToTheWebsiteButton: {
    marginRight: theme.spacing(1),
  },
});

const About = (props) => {
  const {
    classes,
  } = props;

  const appVersion = window.remote.app.getVersion();
  const appJson = window.remote.getGlobal('appJson');
  const utmSource = isMas() ? 'singlebox_app' : 'juli_app';

  const versions = [
    { name: 'WebCatalog Engine', version: appVersion },
    { name: 'Electron', version: window.process.versions.electron },
    { name: 'Node', version: window.process.versions.node },
    { name: 'Chromium', version: window.process.versions.chrome },
  ];

  return (
    <div>
      <DialogContent className={classes.dialogContent}>
        <img
          src={isMas() ? singleboxIconPng : `file://${window.iconPath}`}
          alt={appJson.name}
          className={classes.icon}
        />
        <Typography variant="h6" className={classes.title}>{appJson.name}</Typography>
        <Typography
          variant="body2"
          className={classes.version}
        >
          {isMas() ? `Version ${appVersion}` : 'Powered by WebCatalog'}
        </Typography>
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

        {isMas() ? (
          <>
            <Button
              onClick={() => requestOpenInBrowser(`https://singlebox.app?utm_source=${utmSource}`)}
            >
              Website
            </Button>
            <br />
            <Button
              onClick={() => requestOpenInBrowser(`https://singlebox.app/help?utm_source=${utmSource}`)}
            >
              Help
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => requestOpenInBrowser(`https://webcatalog.app?utm_source=${utmSource}`)}
            >
              WebCatalog Website
            </Button>
            <br />
            <Button
              onClick={() => requestOpenInBrowser(`https://help.webcatalog.app?utm_source=${utmSource}`)}
            >
              WebCatalog Help
            </Button>
          </>
        )}
      </DialogContent>
    </div>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  About,
  null,
  null,
  styles,
);
