/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SvgIcon from '@mui/material/SvgIcon';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import PermCameraMicIcon from '@mui/icons-material/PermCameraMic';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RouterIcon from '@mui/icons-material/Router';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SecurityIcon from '@mui/icons-material/Security';
import ViewListIcon from '@mui/icons-material/ViewList';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { Box } from '@mui/material';

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
import SectionLabs from './section-labs';
import SnackbarTrigger from '../shared/snackbar-trigger';

const HibernationIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <SvgIcon {...props}>
    <path fill="currentColor" d="M18.73,18C15.4,21.69 9.71,22 6,18.64C2.33,15.31 2.04,9.62 5.37,5.93C6.9,4.25 9,3.2 11.27,3C7.96,6.7 8.27,12.39 12,15.71C13.63,17.19 15.78,18 18,18C18.25,18 18.5,18 18.73,18Z" />
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
      labs: { text: 'Experimental', Component: SectionLabs },
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

const Preferences = () => {
  const [activeSectionKey, setActiveSectionKey] = useState(getStaticGlobal('preferencesScrollTo') || 'general');

  const activeSection = sections[activeSectionKey];

  return (
    <Box
      sx={{
        background: 'background.default',
        height: 1,
        width: 1,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: 220,
          color: 'text.primary',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          overflow: 'auto',
        }}
      >
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
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
        }}
      >
        {activeSection.alertMessage && (
          <Alert severity={activeSection.alertSeverity} variant="standard" sx={{ mb: 1 }}>
            <AlertTitle>{activeSection.alertTitle}</AlertTitle>
            {activeSection.alertMessage}
          </Alert>
        )}
        {Object.keys(activeSection.subSections).map((subSectionKey) => {
          const subSection = activeSection.subSections[subSectionKey];
          if (subSection.hidden) return null;
          return (
            <React.Fragment key={subSectionKey}>
              <Typography variant="subtitle2" color="textPrimary" sx={{ pl: 2 }}>
                {subSection.text}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  mt: 0.5,
                  mb: 3,
                  border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'),
                }}
              >
                <subSection.Component />
              </Paper>
            </React.Fragment>
          );
        })}
      </Box>
      <SnackbarTrigger />
    </Box>
  );
};

export default Preferences;
