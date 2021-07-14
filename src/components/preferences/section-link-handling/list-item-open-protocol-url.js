/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import connectComponent from '../../../helpers/connect-component';

import {
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
    maxWidth: 'calc(100vw - 500px)',
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const ListItemOpenProtocolUrls = ({
  classes,
  openProtocolUrlInNewWindow,
}) => (
  <ListItem>
    <ListItemText
      primary="Preferred behavior when opening links triggered by protocols"
    />
    <Select
      value={openProtocolUrlInNewWindow}
      onChange={(e) => requestSetPreference('openProtocolUrlInNewWindow', e.target.value)}
      variant="filled"
      disableUnderline
      margin="dense"
      classes={{
        root: classes.select,
      }}
      className={classes.selectRoot}
    >
      <MenuItem
        value="ask"
        dense
      >
        Always ask
      </MenuItem>
      <MenuItem
        value="mainWindow"
        dense
      >
        Open in main window
      </MenuItem>
      <MenuItem
        value="newWindow"
        dense
      >
        Open in new window
      </MenuItem>
    </Select>
  </ListItem>
);

ListItemOpenProtocolUrls.propTypes = {
  classes: PropTypes.object.isRequired,
  openProtocolUrlInNewWindow: PropTypes.oneOf(['ask', 'newWindow', 'mainWindow']).isRequired,
};

const mapStateToProps = (state) => ({
  openProtocolUrlInNewWindow: state.preferences.openProtocolUrlInNewWindow,
});

export default connectComponent(
  ListItemOpenProtocolUrls,
  mapStateToProps,
  null,
  styles,
);
