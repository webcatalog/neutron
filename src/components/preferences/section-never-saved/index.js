/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';

import connectComponent from '../../../helpers/connect-component';

import { requestSetPreference } from '../../../senders';

const SectionNeverSaved = ({ passwordsNeverSaveDomains }) => (
  <List disablePadding dense>
    {passwordsNeverSaveDomains.length < 1 ? (
      <ListItem disabled>
        <ListItemText primary="Empty." />
      </ListItem>
    ) : (
      <ListItem>
        <Table size="small" aria-label="Never Saved">
          <TableBody>
            {passwordsNeverSaveDomains.map((domain) => (
              <TableRow key={domain}>
                <TableCell component="th" scope="row">
                  {domain}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Remove">
                    <IconButton
                      aria-label="Remove"
                      size="small"
                      onClick={() => {
                        requestSetPreference(
                          'passwordsNeverSaveDomains',
                          passwordsNeverSaveDomains.filter(((item) => item !== domain)),
                        );
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ListItem>
    )}
  </List>
);

SectionNeverSaved.propTypes = {
  passwordsNeverSaveDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  passwordsNeverSaveDomains: state.preferences.passwordsNeverSaveDomains,
});

export default connectComponent(
  SectionNeverSaved,
  mapStateToProps,
);
