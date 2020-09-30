import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { requestOpenInBrowser } from '../../senders';

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
  const utmSource = appJson.id === 'singlebox' ? 'singlebox_app' : 'juli_app';

  const versions = [
    { name: 'Electron Version', version: window.process.versions.electron },
    { name: 'Node Version', version: window.process.versions.node },
    { name: 'Chromium Version', version: window.process.versions.chrome },
  ];

  return (
    <div>
      <DialogContent className={classes.dialogContent}>
        <img src={`file://${window.iconPath}`} alt="WebCatalog" className={classes.icon} />
        <Typography variant="h6" className={classes.title}>{appJson.name}</Typography>
        <Typography
          variant="body2"
          className={classes.version}
        >
          {appJson.id === 'singlebox' ? `Version v${appVersion}` : `Version v${appVersion}. Powered by WebCatalog.`}
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

        {appJson.id === 'singlebox' ? (
          <>
            <Button
              onClick={() => requestOpenInBrowser(`https://atomery.com/singlebox?utm_source=${utmSource}`)}
            >
              Website
            </Button>
            <br />
            <Button
              onClick={() => requestOpenInBrowser(`https://atomery.com/singlebox/support&utm_source=${utmSource}`)}
            >
              Support
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
              onClick={() => requestOpenInBrowser(`https://webcatalog.app/support?utm_source=${utmSource}`)}
            >
              WebCatalog Support
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
