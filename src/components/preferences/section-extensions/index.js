/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogExtensions } from '../../../state/dialog-extensions/actions';

import DialogExtensions from './dialog-extensions';

const SectionExtensions = ({
  onOpenDialogExtensions,
}) => (
  <>
    <List disablePadding dense>
      <ListItem button onClick={() => onOpenDialogExtensions()}>
        <ListItemText primary="Manage extensions (experimental)" />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
    <DialogExtensions />
  </>
);

SectionExtensions.propTypes = {
  onOpenDialogExtensions: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogExtensions,
};

export default connectComponent(
  SectionExtensions,
  null,
  actionCreators,
);
