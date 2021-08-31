/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';

import connectComponent from '../../../helpers/connectComponent';

import ListItemTray from './list-item-tray';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  sliderContainer: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  sliderTitleContainer: {
    paddingTop: `${theme.spacing(1.5)}px !important`,
    width: 100,
  },
  sliderMarkLabel: {
    fontSize: '0.75rem',
  },
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const SectionTray = () => (
  <>
    <List disablePadding dense>
      <ListItemTray />
    </List>
  </>
);

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
  attachToMenubar: state.preferences.attachToMenubar,
  autoHideMenuBar: state.preferences.autoHideMenuBar,
  useSystemTitleBar: state.preferences.useSystemTitleBar,
  windowButtons: state.preferences.windowButtons,
});

export default connectComponent(
  SectionTray,
  mapStateToProps,
  null,
  styles,
);
