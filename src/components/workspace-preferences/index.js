/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import PaletteIcon from '@material-ui/icons/Palette';
import PowerIcon from '@material-ui/icons/Power';

import connectComponent from '../../helpers/connect-component';

import SnackbarTrigger from '../shared/snackbar-trigger';

import SectionAdvanced from './section-advanced';
import SectionAppearance from './section-appearance';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';

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
    width: 204,
    color: theme.palette.text.primary,
  },
  inner: {
    width: 'calc(100% - 224px)',
    float: 'right',
  },
});

const Preferences = ({ classes }) => {
  const sections = {
    appearance: {
      text: 'Appearance',
      Icon: PaletteIcon,
      Component: SectionAppearance,
      ref: useRef(),
    },
    downloads: {
      text: 'Downloads',
      Icon: CloudDownloadIcon,
      Component: SectionDownloads,
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
  };

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections).map((sectionKey, i) => {
            const {
              Icon, text, ref, hidden,
            } = sections[sectionKey];
            if (hidden) return null;
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

export default connectComponent(
  Preferences,
  null,
  null,
  styles,
);
