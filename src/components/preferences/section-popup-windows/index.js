/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import connectComponent from '../../../helpers/connect-component';

import {
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const SectionPopupWindows = ({
  popupTitleBar,
  popupFrameless,
}) => (
  <List disablePadding dense>
    {window.process.platform === 'darwin' && (
    <>
      <ListItem>
        <ListItemText
          primary="Make popup windows frameless"
          secondary={'Hide title bar and "traffic light" (red/yellow/green) buttons.'}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={popupFrameless}
            onChange={(e) => {
              requestSetPreference('popupFrameless', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Show title bar on popup windows"
          secondary="Title bar shows you the title of the current page."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={popupFrameless ? false : popupTitleBar}
            disabled={popupFrameless}
            onChange={(e) => {
              requestSetPreference('popupTitleBar', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </>
    )}
  </List>
);

SectionPopupWindows.propTypes = {
  popupTitleBar: PropTypes.bool.isRequired,
  popupFrameless: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  popupTitleBar: state.preferences.popupTitleBar,
  popupFrameless: state.preferences.popupFrameless,
});

export default connectComponent(
  SectionPopupWindows,
  mapStateToProps,
  null,
  styles,
);
