/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import ExtensionIcon from '@material-ui/icons/Extension';
import LanguageIcon from '@material-ui/icons/Language';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/Palette';
import PermCameraMicIcon from '@material-ui/icons/PermCameraMic';
import PowerIcon from '@material-ui/icons/Power';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RouterIcon from '@material-ui/icons/Router';
import SecurityIcon from '@material-ui/icons/Security';
import StorefrontIcon from '@material-ui/icons/Storefront';
import UpdateIcon from '@material-ui/icons/Update';
import WidgetsIcon from '@material-ui/icons/Widgets';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';
import isStandalone from '../../helpers/is-standalone';
import getStaticGlobal from '../../helpers/get-static-global';

import SectionAdvanced from './section-advanced';
import SectionAppearance from './section-appearance';
import SectionAudioVideo from './section-audio-video';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';
import SectionExtensions from './section-extensions';
import SectionGeneral from './section-general';
import SectionLanguages from './section-languages';
import SectionMiscs from './section-miscs';
import SectionNetwork from './section-network';
import SectionNotifications from './section-notifications';
import SectionPrivacySecurity from './section-privacy-security';
import SectionReset from './section-reset';
import SectionUpdates from './section-updates';
import SectionMoreApps from './section-more-apps';
import SectionAccountLicensing from './section-account-licensing';

import SnackbarTrigger from '../shared/snackbar-trigger';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
  sectionTitle: {
    paddingLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  sidebar: {
    position: 'fixed',
    width: 200,
    color: theme.palette.text.primary,
  },
  inner: {
    width: 'calc(100% - 224px)',
    float: 'right',
  },
});

const Preferences = ({
  classes,
}) => {
  const appJson = getStaticGlobal('appJson');

  const sections = {
    accountLicensing: {
      text: 'Licensing',
      Icon: CheckCircleIcon,
      Component: SectionAccountLicensing,
      ref: useRef(),
      hidden: isMas() && appJson.registered,
    },
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      Component: SectionGeneral,
      ref: useRef(),
    },
    appearance: {
      text: 'Appearance',
      Icon: PaletteIcon,
      Component: SectionAppearance,
      ref: useRef(),
    },
    notifications: {
      text: 'Notifications',
      Icon: NotificationsIcon,
      Component: SectionNotifications,
      ref: useRef(),
    },
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      Component: SectionExtensions,
      ref: useRef(),
      hidden: isMas(),
    },
    languages: {
      text: 'Languages',
      Icon: LanguageIcon,
      Component: SectionLanguages,
      ref: useRef(),
    },
    downloads: {
      text: 'Downloads',
      Icon: CloudDownloadIcon,
      Component: SectionDownloads,
      ref: useRef(),
    },
    audioVideo: {
      text: 'Audio & Video',
      Icon: PermCameraMicIcon,
      Component: SectionAudioVideo,
      ref: useRef(),
    },
    network: {
      text: 'Network',
      Icon: RouterIcon,
      Component: SectionNetwork,
      ref: useRef(),
    },
    privacy: {
      text: 'Privacy & Security',
      Icon: SecurityIcon,
      Component: SectionPrivacySecurity,
      ref: useRef(),
    },
    developers: {
      text: 'Developers',
      Icon: CodeIcon,
      Component: SectionDevelopers,
      ref: useRef(),
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      Component: SectionAdvanced,
      ref: useRef(),
    },
    updates: {
      text: 'Updates',
      Icon: UpdateIcon,
      ref: useRef(),
      Component: SectionUpdates,
      hidden: isMas(),
    },
    reset: {
      text: 'Reset',
      Icon: RotateLeftIcon,
      Component: SectionReset,
      ref: useRef(),
    },
    moreApps: {
      text: 'More Apps',
      Icon: StorefrontIcon,
      Component: SectionMoreApps,
      ref: useRef(),
      hidden: !isMas() && !isStandalone(),
    },
    miscs: {
      text: 'Miscellaneous',
      Icon: MoreHorizIcon,
      Component: SectionMiscs,
      ref: useRef(),
    },
  };

  useEffect(() => {
    const scrollTo = getStaticGlobal('preferencesScrollTo');
    if (!scrollTo) return;
    sections[scrollTo].ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections)
            .filter((sectionKey) => !sections[sectionKey].hidden)
            .map((sectionKey, i) => {
              const {
                Icon, text, ref,
              } = sections[sectionKey];
              return (
                <React.Fragment key={sectionKey}>
                  {i > 0 && <Divider />}
                  <ListItem button onClick={() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
        </List>
      </div>
      <div className={classes.inner}>
        {Object.keys(sections).map((sectionKey) => {
          const section = sections[sectionKey];
          if (section.hidden) return null;
          return (
            <React.Fragment key={sectionKey}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={section.ref}>
                {section.text}
              </Typography>
              <Paper elevation={0} className={classes.paper}>
                <section.Component />
              </Paper>
            </React.Fragment>
          );
        })}
      </div>
      <SnackbarTrigger />
    </div>
  );
};

Preferences.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  iapPurchased: state.preferences.iapPurchased,
  standaloneRegistered: state.preferences.standaloneRegistered,
});

export default connectComponent(
  Preferences,
  mapStateToProps,
  null,
  styles,
);