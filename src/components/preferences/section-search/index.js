/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import connectComponent from '../../../helpers/connect-component';

import {
  requestSetPreference,
} from '../../../senders';

import searchEngines from '../../../constants/search-engines';

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

const SectionSearch = ({
  classes,
  searchEngine,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Search engine"
        secondary="Search engine used in the address bar and other contexts."
      />
      <Select
        value={searchEngine}
        onChange={(e) => requestSetPreference('searchEngine', e.target.value)}
        variant="filled"
        disableUnderline
        margin="dense"
        classes={{
          root: classes.select,
        }}
        className={classes.selectRoot}
      >
        {Object.keys(searchEngines).map((optKey) => {
          const opt = searchEngines[optKey];
          return (
            <MenuItem
              key={optKey}
              value={optKey}
              dense
            >
              {opt.name}
            </MenuItem>
          );
        })}
      </Select>
    </ListItem>
  </List>
);

SectionSearch.propTypes = {
  classes: PropTypes.object.isRequired,
  searchEngine: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  searchEngine: state.preferences.searchEngine,
});

export default connectComponent(
  SectionSearch,
  mapStateToProps,
  null,
  styles,
);
