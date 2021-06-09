/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import ExtensionIcon from '@material-ui/icons/Extension';
import InfoIcon from '@material-ui/icons/Info';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/Palette';
import PowerIcon from '@material-ui/icons/Power';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SecurityIcon from '@material-ui/icons/Security';
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
import SectionSystem from './section-system';
import SectionLanguage from './section-language';
import SectionAbout from './section-about';
import SectionNetwork from './section-network';
import SectionNotifications from './section-notifications';
import SectionPrivacySecurity from './section-privacy-security';
import SectionReset from './section-reset';
import SectionUpdates from './section-updates';
import SectionMoreApps from './section-more-apps';
import SectionAccountLicensing from './section-account-licensing';
import SectionMode from './section-mode';
import SectionTray from './section-tray';
import SectionHome from './section-home';
import SectionExit from './section-exit';
import SectionFonts from './section-fonts';
import SectionWindow from './section-window';

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

  const [activeSectionKey, setActiveSectionKey] = useState(getStaticGlobal('preferencesScrollTo') || 'general');

  const sections = {
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      subSections: {
        licensing: { text: 'Licensing', Component: SectionAccountLicensing, hidden: isMas() && appJson.registered },
        home: { text: 'Home', Component: SectionHome, hidden: !(appJson.url && !isMas() && !isStandalone()) },
        mode: { text: 'Mode', Component: SectionMode, hidden: !appJson.id.startsWith('group-') && appJson.id !== 'clovery' },
        tray: { text: window.process.platform === 'darwin' ? 'Menu bar' : 'Tray', Component: SectionTray },
        general: { text: 'System', Component: SectionSystem },
        downloads: { text: 'Downloads', Component: SectionDownloads },
        language: { text: 'Language', Component: SectionLanguage },
        exit: { text: 'Exit', Component: SectionExit },
      },
    },
    appearance: {
      text: 'Appearance',
      Icon: PaletteIcon,
      subSections: {
        appearance: { text: 'Appearance', Component: SectionAppearance },
        window: { text: 'Window', Component: SectionWindow },
        fonts: { text: 'Fonts', Component: SectionFonts },
      },
    },
    notifications: {
      text: 'Notifications',
      Icon: NotificationsIcon,
      subSections: {
        notifications: { text: 'Notifications', Component: SectionNotifications },
      },
    },
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      hidden: isMas(),
      subSections: {
        extensions: { text: 'Extensions', Component: SectionExtensions },
      },
    },
    privacySecuriy: {
      text: 'Privacy & Security',
      Icon: SecurityIcon,
      subSections: {
        privacySecuriy: { text: 'Privacy & Security', Component: SectionPrivacySecurity },
      },
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      subSections: {
        advanced: { text: 'Advanced', Component: SectionAdvanced },
        audioVideo: { text: 'Audio & Video', Component: SectionAudioVideo },
        network: { text: 'Network', Component: SectionNetwork },
        developers: { text: 'Developers', Component: SectionDevelopers },
      },
    },
    updates: {
      text: 'Updates',
      Icon: UpdateIcon,
      subSections: {
        updates: { text: 'Updates', Component: SectionUpdates },
      },
    },
    reset: {
      text: 'Reset',
      Icon: RotateLeftIcon,
      subSections: {
        reset: { text: 'Reset', Component: SectionReset },
      },
    },
    miscs: {
      text: 'About',
      Icon: InfoIcon,
      subSections: {
        about: { text: 'About', Component: SectionAbout },
        moreApps: { text: 'More Apps', Component: SectionMoreApps },
      },
    },
  };

  const activeSection = sections[activeSectionKey];

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense disablePadding>
          {Object.keys(sections)
            .filter((sectionKey) => !sections[sectionKey].hidden)
            .map((sectionKey, i) => {
              const {
                Icon, text,
              } = sections[sectionKey];
              return (
                <React.Fragment key={sectionKey}>
                  {i > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => setActiveSectionKey(sectionKey)}
                    selected={sectionKey === activeSectionKey}
                  >
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
        {Object.keys(activeSection.subSections).map((subSectionKey) => {
          const subSection = activeSection.subSections[subSectionKey];
          if (subSection.hidden) return null;
          return (
            <React.Fragment key={subSectionKey}>
              <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle}>
                {subSection.text}
              </Typography>
              <Paper elevation={0} className={classes.paper}>
                <subSection.Component />
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
