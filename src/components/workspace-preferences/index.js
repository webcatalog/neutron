/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CachedIcon from '@mui/icons-material/Cached';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import PermCameraMicIcon from '@mui/icons-material/PermCameraMic';
import RouterIcon from '@mui/icons-material/Router';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SecurityIcon from '@mui/icons-material/Security';
import WidgetsIcon from '@mui/icons-material/Widgets';
import makeStyles from '@mui/styles/makeStyles';

import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import {
  requestShowPreferencesWindow,
} from '../../senders';

import SnackbarTrigger from '../shared/snackbar-trigger';

import SectionAudioVideo from './section-audio-video';
import SectionAutoReload from './section-auto-reload';
import SectionBadge from './section-badge';
import SectionDarkReader from './section-dark-reader';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';
import SectionLinkHandling from './section-link-handling';
import SectionNetwork from './section-network';
import SectionNotifications from './section-notifications';
import SectionContents from './section-contents';
import SectionWorkspace from './section-workspace';
import getStaticGlobal from '../../helpers/get-static-global';
import isMenubarBrowser from '../../helpers/is-menubar-browser';

const useStyles = makeStyles((theme) => ({
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
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
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
  globalPrefsButton: {
    position: 'absolute',
    bottom: theme.spacing(1),
    left: theme.spacing(1),
  },
  alert: {
    marginBottom: theme.spacing(1),
  },
}));

const Preferences = () => {
  const classes = useStyles();

  const [activeSectionKey, setActiveSectionKey] = useState('general');

  const sections = {
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      subSections: {
        workspace: { text: getWorkspaceFriendlyName(), Component: SectionWorkspace },
      },
    },
    downloads: {
      text: 'Downloads',
      Icon: SaveAltIcon,
      subSections: {
        downloads: { text: 'Downloads', Component: SectionDownloads },
      },
    },
    appearance: {
      text: 'Appearance',
      Icon: PaletteIcon,
      hidden: isMenubarBrowser(),
      subSections: {
        appearance: { text: 'Dark Reader', Component: SectionDarkReader },
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
    audioVideo: {
      text: 'Audio & Video',
      Icon: PermCameraMicIcon,
      subSections: {
        audioVideo: { text: 'Audio & Video', Component: SectionAudioVideo },
      },
    },
    network: {
      text: 'Network',
      Icon: RouterIcon,
      // if the workspaces share the same session
      // users won't be able to set proxy per workspace
      hidden: window.mode === 'workspace-preferences'
        && getStaticGlobal('shareWorkspaceBrowsingData'),
      subSections: {
        network: { text: 'Network', Component: SectionNetwork },
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
    privacy: {
      text: 'Privacy',
      Icon: SecurityIcon,
      subSections: {
        contents: { text: 'Contents', Component: SectionContents },
      },
    },
    developers: {
      text: 'Developers',
      Icon: CodeIcon,
      subSections: {
        developers: { text: 'Developers', Component: SectionDevelopers },
      },
    },
  };

  const activeSection = sections[activeSectionKey];

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections).map((sectionKey) => {
            const {
              Icon, text, hidden,
            } = sections[sectionKey];
            if (hidden) return null;
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

        <Button
          variant="link"
          color="primary"
          size="small"
          className={classes.globalPrefsButton}
          startIcon={<ArrowBackIosIcon />}
          onClick={() => requestShowPreferencesWindow()}
        >
          Global Preferences
        </Button>
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

export default Preferences;
