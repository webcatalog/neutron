/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CachedIcon from '@material-ui/icons/Cached';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CodeIcon from '@material-ui/icons/Code';
import InfoIcon from '@material-ui/icons/Info';
import LinkIcon from '@material-ui/icons/Link';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LockIcon from '@material-ui/icons/Lock';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/Palette';
import PermCameraMicIcon from '@material-ui/icons/PermCameraMic';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RouterIcon from '@material-ui/icons/Router';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SecurityIcon from '@material-ui/icons/Security';
import ViewListIcon from '@material-ui/icons/ViewList';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import WidgetsIcon from '@material-ui/icons/Widgets';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';
import isAppx from '../../helpers/is-appx';
import isStandalone from '../../helpers/is-standalone';
import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';
import isMenubarBrowser from '../../helpers/is-menubar-browser';

import SectionAbout from './section-about';
import SectionAccountLicensing from './section-account-licensing';
import SectionAppLock from './section-app-lock';
import SectionAutoReload from './section-auto-reload';
import SectionAutofill from './section-autofill';
import SectionBadge from './section-badge';
import SectionContents from './section-contents';
import SectionDarkReader from './section-dark-reader';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';
import SectionExit from './section-exit';
import SectionExtensions from './section-extensions';
import SectionFonts from './section-fonts';
import SectionHardware from './section-hardware';
import SectionHibernation from './section-hibernation';
import SectionHome from './section-home';
import SectionLanguage from './section-language';
import SectionLinkHandling from './section-link-handling';
import SectionLocationPermission from './section-location-permissions';
import SectionMode from './section-mode';
import SectionMoreApps from './section-more-apps';
import SectionNetwork from './section-network';
import SectionNeverSaved from './section-never-saved';
import SectionNotifications from './section-notifications';
import SectionPermissions from './section-permissions';
import SectionPopupWindows from './section-popup-windows';
import SectionPrivacy from './section-privacy';
import SectionReset from './section-reset';
import SectionSavedPassword from './section-saved-passwords';
import SectionSearch from './section-search';
import SectionSystem from './section-system';
import SectionTabs from './section-tabs';
import SectionTelemetry from './section-telemetry';
import SectionTheme from './section-theme';
import SectionThrottling from './section-throttling';
import SectionTitlebar from './section-titlebar';
import SectionTray from './section-tray';
import SectionView from './section-view';
import SectionWindow from './section-window';
import SectionWorkspaces from './section-workspaces';

import SnackbarTrigger from '../shared/snackbar-trigger';

const styles = (theme) => ({
  root: {
    background: theme.palette.background.default,
    height: '100%',
    width: '100%',
    display: 'flex',
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
    width: 220,
    color: theme.palette.text.primary,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'auto',
  },
  inner: {
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
  },
  alert: {
    marginBottom: theme.spacing(1),
  },
});

const HibernationIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <SvgIcon {...props}>
    <path fill="currentColor" d="M18.73,18C15.4,21.69 9.71,22 6,18.64C2.33,15.31 2.04,9.62 5.37,5.93C6.9,4.25 9,3.2 11.27,3C7.96,6.7 8.27,12.39 12,15.71C13.63,17.19 15.78,18 18,18C18.25,18 18.5,18 18.73,18Z" />
  </SvgIcon>
);

const ScienceIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <SvgIcon {...props}>
    <path d="M19.8,18.4L14,10.67V6.5l1.35-1.69C15.61,4.48,15.38,4,14.96,4H9.04C8.62,4,8.39,4.48,8.65,4.81L10,6.5v4.17L4.2,18.4 C3.71,19.06,4.18,20,5,20h14C19.82,20,20.29,19.06,19.8,18.4z" />
  </SvgIcon>
);

const appJson = getStaticGlobal('appJson');
const sections = {
  licensing: {
    Icon: CheckCircleIcon,
    text: 'Licensing',
    Component: SectionAccountLicensing,
    hidden: isAppx() || (isMas() && appJson.registered),
    subSections: {
      licensing: {
        text: 'Licensing',
        Component: SectionAccountLicensing,
      },
    },
  },
  general: {
    text: 'General',
    Icon: WidgetsIcon,
    subSections: {
      home: { text: 'Home', Component: SectionHome, hidden: !(appJson.url && !isMas() && !isStandalone() && !isAppx()) },
      mode: { text: 'Mode', Component: SectionMode, hidden: Boolean(appJson.url) },
      language: { text: 'Language', Component: SectionLanguage },
      search: { text: 'Search', Component: SectionSearch },
      system: { text: 'System', Component: SectionSystem },
      hardward: { text: 'Hardware', Component: SectionHardware },
      exit: { text: 'Exit', Component: SectionExit },
    },
  },
  workspaces: {
    text: getWorkspaceFriendlyName(true),
    Icon: ViewListIcon,
    subSections: {
      workspaces: { text: getWorkspaceFriendlyName(true), Component: SectionWorkspaces },
    },
  },
  appearance: {
    text: 'Appearance',
    Icon: PaletteIcon,
    subSections: {
      theme: { text: 'Theme', Component: SectionTheme },
      view: { text: 'View', Component: SectionView },
      darkReader: { text: 'Dark Reader', Component: SectionDarkReader, hidden: isMenubarBrowser() },
      fonts: { text: 'Fonts', Component: SectionFonts },
    },
  },
  window: {
    text: window.process.platform === 'darwin' ? 'Windows & Menu Bar' : 'Windows & Tray',
    Icon: WebAssetIcon,
    subSections: {
      titlebar: { text: 'Title Bar', Component: SectionTitlebar, hidden: window.process.platform === 'darwin' },
      tray: { text: window.process.platform === 'darwin' ? 'Menu Bar' : 'Tray', Component: SectionTray, hidden: isMenubarBrowser() },
      window: { text: 'Main Window', Component: SectionWindow },
      popupWindows: { text: 'Popup Windows', Component: SectionPopupWindows, hidden: window.process.platform !== 'darwin' },
      tabs: { text: 'Tabs', Component: SectionTabs, hidden: process.env.NODE_ENV === 'production' },
    },
  },
  notifications: {
    text: 'Notifications',
    Icon: NotificationsIcon,
    alertMessage: 'Due to technical limitations, web apps which require Web Push API (such as Google Calendar, Messenger or Linear) won\'t be able to push notifications.',
    alertTitle: 'Notes',
    alertSeverity: 'info',
    subSections: {
      notifications: { text: 'Notifications', Component: SectionNotifications },
      badge: { text: 'Badge', Component: SectionBadge },
    },
  },
  autofill: {
    text: 'Autofill',
    Icon: AssignmentIcon,
    hidden: !getStaticGlobal('keytarLoaded'),
    subSections: {
      autofill: { text: 'Autofill', Component: SectionAutofill },
      savedPasswords: { text: 'Saved Passwords', Component: SectionSavedPassword },
      neverSaved: { text: 'Never Saved', Component: SectionNeverSaved },
    },
  },
  downloads: {
    text: 'Downloads',
    Icon: SaveAltIcon,
    subSections: {
      downloads: { text: 'Downloads', Component: SectionDownloads },
    },
  },
  audioVideo: {
    text: 'Audio & Video',
    Icon: PermCameraMicIcon,
    hidden: window.process.platform !== 'darwin',
    subSections: {
      permissions: { text: 'Permissions', Component: SectionPermissions },
    },
  },
  permision: {
    text: 'Location',
    Icon: LocationOnIcon,
    subSections: {
      permissions: { text: 'Permissions', Component: SectionLocationPermission },
    },
    hidden: window.process.platform !== 'darwin' || isMas(),
  },
  network: {
    text: 'Network',
    Icon: RouterIcon,
    subSections: {
      network: { text: 'Network', Component: SectionNetwork },
    },
  },
  hibernation: {
    text: 'Hibernation',
    Icon: HibernationIcon,
    subSections: {
      hibernation: { text: 'Hibernation', Component: SectionHibernation },
      throttling: { text: 'Throttling', Component: SectionThrottling },
    },
  },
  linkHandling: {
    text: 'Link Handling',
    Icon: LinkIcon,
    subSections: {
      linkHandling: { text: 'Link Handling', Component: SectionLinkHandling },
    },
  },
  autoReload: {
    text: 'Auto Reload',
    Icon: CachedIcon,
    subSections: {
      autoReload: { text: 'Auto Reload', Component: SectionAutoReload },
    },
  },
  appLock: {
    text: 'App Lock',
    Icon: LockIcon,
    hidden: isMenubarBrowser() || !getStaticGlobal('keytarLoaded'),
    subSections: {
      appLock: { text: 'App Lock', Component: SectionAppLock },
    },
  },
  privacy: {
    text: 'Privacy',
    Icon: SecurityIcon,
    subSections: {
      privacy: { text: 'Privacy', Component: SectionPrivacy },
      contents: { text: 'Contents', Component: SectionContents },
    },
  },
  telemetry: {
    text: 'Telemetry',
    Icon: AssessmentIcon,
    subSections: {
      telemetry: { text: 'Telemetry', Component: SectionTelemetry },
    },
  },
  developers: {
    text: 'Developers',
    Icon: CodeIcon,
    subSections: {
      developers: { text: 'Developers', Component: SectionDevelopers },
    },
  },
  labs: {
    text: 'Labs',
    Icon: ScienceIcon,
    hidden: isMas() || isAppx() || isMenubarBrowser(),
    alertMessage: 'Extension support is unstable and under development. Some extensions might crash the app or might not function correctly. Use at your own risk.',
    alertTitle: 'Warning',
    alertSeverity: 'error',
    subSections: {
      extensions: { text: 'Extensions (experimental)', Component: SectionExtensions },
    },
  },
  reset: {
    text: 'Reset',
    Icon: RotateLeftIcon,
    subSections: {
      reset: { text: 'Reset', Component: SectionReset },
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

const Preferences = ({
  classes,
}) => {
  const [activeSectionKey, setActiveSectionKey] = useState(getStaticGlobal('preferencesScrollTo') || 'general');

  const activeSection = sections[activeSectionKey];

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections)
            .filter((sectionKey) => !sections[sectionKey].hidden)
            .map((sectionKey) => {
              const {
                Icon, text,
              } = sections[sectionKey];
              return (
                <React.Fragment key={sectionKey}>
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
        {activeSection.alertMessage && (
          <Alert severity={activeSection.alertSeverity} variant="standard" className={classes.alert}>
            <AlertTitle>{activeSection.alertTitle}</AlertTitle>
            {activeSection.alertMessage}
          </Alert>
        )}
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
