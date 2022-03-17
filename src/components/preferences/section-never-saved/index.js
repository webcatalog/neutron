/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { useSelector } from 'react-redux';

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

import { requestSetPreference } from '../../../senders';

const SectionNeverSaved = () => {
  // eslint-disable-next-line max-len
  const passwordsNeverSaveDomains = useSelector((state) => state.preferences.passwordsNeverSaveDomains);

  return (
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
};

export default SectionNeverSaved;
