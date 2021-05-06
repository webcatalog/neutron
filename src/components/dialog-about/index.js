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
import getStaticGlobal from '../../helpers/get-static-global';
import getUtmSource from '../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
  requestShowOpenSourceNoticesWindow,
} from '../../senders';

import cloveryIconPng from '../../images/products/clovery-mac-icon-128@2x.png';
import panmailIconPng from '../../images/products/panmail-mac-icon-128@2x.png';
import pantextIconPng from '../../images/products/pantext-mac-icon-128@2x.png';
import isStandalone from '../../helpers/is-standalone';

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

  const appJson = getStaticGlobal('appJson');
  const appVersion = window.remote.app.getVersion();
  const utmSource = getUtmSource();

  const versions = [
    { name: 'Neutron', version: appVersion },
    { name: 'Electron', version: window.process.versions.electron },
    { name: 'Node', version: window.process.versions.node },
    { name: 'Chromium', version: window.process.versions.chrome },
  ];

  return (
    <div>
      <DialogContent className={classes.dialogContent}>
        <img
          src={(() => {
            if (appJson.id === 'clovery') return cloveryIconPng;
            if (appJson.id === 'pantext' || appJson.id === 'pantext-plus') return pantextIconPng;
            if (appJson.id === 'panmail') return panmailIconPng;
            return `file://${window.iconPath}`;
          })()}
          alt={appJson.name}
          className={classes.icon}
        />
        <Typography variant="h6" className={classes.title}>{appJson.name}</Typography>
        <Typography
          variant="body2"
          className={classes.version}
        >
          {`Version ${appVersion}`}
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
        {!isMas() && !isStandalone() && (
          <Typography
            variant="body2"
            className={classes.version}
          >
            Powered by WebCatalog
          </Typography>
        )}

        {isMas() && (
          <>
            <Button
              onClick={() => requestOpenInBrowser(`macappstore://apps.apple.com/app/id${appJson.macAppStoreId}`)}
            >
              Mac App Store
            </Button>
            <br />
          </>
        )}

        {(isMas() || isStandalone()) ? (
          <>
            <Button
              onClick={() => {
                if (appJson.hostname) {
                  return requestOpenInBrowser(`https://${appJson.hostname}?utm_source=${utmSource}`);
                }
                return requestOpenInBrowser(`https://${appJson.id}.app?utm_source=${utmSource}`);
              }}
            >
              Website
            </Button>
            <br />
            <Button
              onClick={() => {
                if (appJson.hostname) {
                  return requestOpenInBrowser(`https://${appJson.hostname}/help?utm_source=${utmSource}`);
                }
                return requestOpenInBrowser(`https://${appJson.id}.app/help?utm_source=${utmSource}`);
              }}
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

        <br />
        <Button
          onClick={() => requestShowOpenSourceNoticesWindow()}
        >
          Open Source Notices
        </Button>
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
