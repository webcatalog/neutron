/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogExtensions } from '../../../state/dialog-extensions/actions';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const DialogExtensions = ({
  classes,
  onOpenDialogExtensions,
}) => (
  <>
    <Paper elevation={0} className={classes.paper}>
      <List disablePadding dense>
        <ListItem button onClick={() => onOpenDialogExtensions()}>
          <ListItemText primary="Manage extensions (experimental)" />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>
    </Paper>
    <DialogExtensions />
  </>
);

DialogExtensions.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogExtensions: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogExtensions,
};

export default connectComponent(
  DialogExtensions,
  null,
  actionCreators,
  styles,
);
