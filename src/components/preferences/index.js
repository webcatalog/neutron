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
import SecurityIcon from '@material-ui/icons/Security';
import WidgetsIcon from '@material-ui/icons/Widgets';
import ViewListIcon from '@material-ui/icons/ViewList';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';
import isAppx from '../../helpers/is-appx';
import isStandalone from '../../helpers/is-standalone';
import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import SectionAbout from './section-about';
import SectionAccountLicensing from './section-account-licensing';
import SectionAppLock from './section-app-lock';
import SectionAudioVideo from './section-audio-video';
import SectionAutoReload from './section-auto-reload';
import SectionBadge from './section-badge';
import SectionBrowsing from './section-browsing';
import SectionDarkReader from './section-dark-reader';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';
import SectionExit from './section-exit';
import SectionExtensions from './section-extensions';
import SectionFonts from './section-fonts';
import SectionHardware from './section-hardware';
import SectionHome from './section-home';
import SectionLanguage from './section-language';
import SectionLinkHandling from './section-link-handling';
import SectionMode from './section-mode';
import SectionMoreApps from './section-more-apps';
import SectionNetwork from './section-network';
import SectionNotifications from './section-notifications';
import SectionPerformance from './section-performance';
import SectionReset from './section-reset';
import SectionSystem from './section-system';
import SectionTelemetry from './section-telemetry';
import SectionTheme from './section-theme';
import SectionView from './section-view';
import SectionWindow from './section-window';
import SectionWorkspaces from './section-workspaces';
import SectionPermissions from './section-permissions';

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
  classes, hasWorkspaces,
}) => {
  const appJson = getStaticGlobal('appJson');

  const [activeSectionKey, setActiveSectionKey] = useState(getStaticGlobal('preferencesScrollTo') || 'general');

  const sections = {
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      subSections: {
        licensing: {
          text: 'Licensing',
          Component: SectionAccountLicensing,
          hidden: isAppx() || (isMas() && appJson.registered),
        },
        home: { text: 'Home', Component: SectionHome, hidden: !(appJson.url && !isMas() && !isStandalone() && !isAppx()) },
        mode: { text: 'Mode', Component: SectionMode, hidden: !appJson.id.startsWith('group-') && appJson.id !== 'clovery' },
        window: { text: window.process.platform === 'darwin' ? 'Window & Menu Bar' : 'Window & Tray', Component: SectionWindow },
        permissions: { text: 'Permissions', Component: SectionPermissions, hidden: window.process.platform !== 'darwin' },
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
        theme: { text: 'Theme', Component: SectionTheme },
        darkReader: { text: 'Dark Reader', Component: SectionDarkReader },
        view: { text: 'View', Component: SectionView },
        fonts: { text: 'Fonts', Component: SectionFonts },
      },
    },
    notifications: {
      text: 'Notifications',
      Icon: NotificationsIcon,
      subSections: {
        notifications: { text: 'Notifications', Component: SectionNotifications },
        badge: { text: 'Badge', Component: SectionBadge },
      },
    },
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      hidden: process.env.NODE_ENV === 'production' || isMas() || isAppx(),
      subSections: {
        extensions: { text: 'Extensions (experimental)', Component: SectionExtensions },
      },
    },
    privacySecuriy: {
      text: 'Privacy & Security',
      Icon: SecurityIcon,
      subSections: {
        browsingData: { text: 'Browsing', Component: SectionBrowsing },
        appLock: { text: 'App Lock', Component: SectionAppLock },
        telemetry: { text: 'Telemetry', Component: SectionTelemetry },
      },
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      subSections: {
        linkHandling: { text: 'Link Handling', Component: SectionLinkHandling },
        performance: { text: 'Performance', Component: SectionPerformance },
        audioVideo: { text: 'Audio & Video', Component: SectionAudioVideo },
        network: { text: 'Network', Component: SectionNetwork },
        hardward: { text: 'Hardware', Component: SectionHardware },
        autoReload: { text: 'Auto Reload', Component: SectionAutoReload },
        developers: { text: 'Developers', Component: SectionDevelopers },
        reset: { text: 'Reset', Component: SectionReset },
      },
    },
    workspaces: {
      text: getWorkspaceFriendlyName(true),
      Icon: ViewListIcon,
      hidden: !hasWorkspaces,
      subSections: {
        workspaces: { text: getWorkspaceFriendlyName(true), Component: SectionWorkspaces },
      },
    },
    about: {
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
  hasWorkspaces: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  iapPurchased: state.preferences.iapPurchased,
  standaloneRegistered: state.preferences.standaloneRegistered,
  hasWorkspaces: Object.keys(state.workspaces.workspaces).length > 0,
});

export default connectComponent(
  Preferences,
  mapStateToProps,
  null,
  styles,
);
