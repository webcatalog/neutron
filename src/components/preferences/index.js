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

import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CachedIcon from '@material-ui/icons/Cached';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CodeIcon from '@material-ui/icons/Code';
import ExtensionIcon from '@material-ui/icons/Extension';
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
import TabIcon from '@material-ui/icons/Tab';
import ViewListIcon from '@material-ui/icons/ViewList';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import WidgetsIcon from '@material-ui/icons/Widgets';

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
import SectionAutofill from './section-autofill';
import SectionBadge from './section-badge';
import SectionPrivacy from './section-privacy';
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
import SectionLocationPermission from './section-location-permissions';
import SectionMode from './section-mode';
import SectionMoreApps from './section-more-apps';
import SectionNetwork from './section-network';
import SectionNotifications from './section-notifications';
import SectionPerformance from './section-performance';
import SectionPermissions from './section-permissions';
import SectionReset from './section-reset';
import SectionSearch from './section-search';
import SectionSystem from './section-system';
import SectionTelemetry from './section-telemetry';
import SectionTab from './section-tab';
import SectionTheme from './section-theme';
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
});

const Preferences = ({
  classes, hasWorkspaces,
}) => {
  const appJson = getStaticGlobal('appJson');

  const [activeSectionKey, setActiveSectionKey] = useState(getStaticGlobal('preferencesScrollTo') || 'general');

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
      hidden: !hasWorkspaces,
      subSections: {
        workspaces: { text: getWorkspaceFriendlyName(true), Component: SectionWorkspaces },
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
    window: {
      text: window.process.platform === 'darwin' ? 'Window & Menu Bar' : 'Window & Tray',
      Icon: WebAssetIcon,
      subSections: {
        window: { text: 'Window', Component: SectionWindow },
        tray: { text: window.process.platform === 'darwin' ? 'Menu Bar' : 'Tray', Component: SectionTray },
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
    autofill: {
      text: 'Autofill',
      Icon: AssignmentIcon,
      subSections: {
        badge: { text: 'Passwords', Component: SectionAutofill },
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
      subSections: {
        permissions: { text: 'Permissions', Component: SectionPermissions, hidden: window.process.platform !== 'darwin' },
        audioVideo: { text: 'Audio & Video', Component: SectionAudioVideo },
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
      Icon: (props) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <SvgIcon {...props}>
          <path fill="currentColor" d="M18.73,18C15.4,21.69 9.71,22 6,18.64C2.33,15.31 2.04,9.62 5.37,5.93C6.9,4.25 9,3.2 11.27,3C7.96,6.7 8.27,12.39 12,15.71C13.63,17.19 15.78,18 18,18C18.25,18 18.5,18 18.73,18Z" />
        </SvgIcon>
      ),
      subSections: {
        hibernation: { text: 'Hibernation', Component: SectionPerformance },
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
      subSections: {
        appLock: { text: 'App Lock', Component: SectionAppLock },
      },
    },
    privacy: {
      text: 'Privacy',
      Icon: SecurityIcon,
      subSections: {
        privacy: { text: 'Privacy', Component: SectionPrivacy },
      },
    },
    tabs: {
      text: 'Tabs',
      Icon: TabIcon,
      subSections: {
        telemetry: { text: 'Tabs', Component: SectionTab },
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
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      hidden: isMas() || isAppx(),
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
