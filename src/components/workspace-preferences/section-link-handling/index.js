/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import makeStyles from '@mui/styles/makeStyles';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';
import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogExternalUrls } from '../../../state/dialog-external-urls/actions';

import DialogExternalUrls from '../../shared/dialog-external-urls';
import DialogInternalUrls from '../../shared/dialog-internal-urls';

const useStyles = makeStyles((theme) => ({
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
}));

const SectionLinkHandling = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const alwaysOpenInMainWindow = useSelector((state) => state.preferences.alwaysOpenInMainWindow);
  const externalUrlRule = useSelector((state) => state.preferences.externalUrlRule);
  const internalUrlRule = useSelector((state) => state.preferences.internalUrlRule);
  const formExternalUrlRule = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.externalUrlRule,
  );
  const formInternalUrlRule = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.internalUrlRule,
  );
  const formAlwaysOpenInMainWindow = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.alwaysOpenInMainWindow,
  );

  return (
    <>
      <List disablePadding dense>
        <ListItem button onClick={() => dispatch(openDialogExternalUrls())}>
          <ListItemText
            primary="External URLs"
            secondary={(() => {
              if (formExternalUrlRule != null) {
                return `/^${formExternalUrlRule}$/i`;
              }
              return `Use global preference (${externalUrlRule ? `/^${externalUrlRule}$/i` : 'Not set'})`;
            })()}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => dispatch(openDialogInternalUrls())}>
          <ListItemText
            primary="Internal URLs"
            secondary={(() => {
              if (formInternalUrlRule != null) {
                return `/^${formInternalUrlRule}$/i`;
              }
              return `Use global preference (${internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'})`;
            })()}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Always open internal URLs in main window"
            secondary="Otherwise, the app will open internal URLs in main window or popup windows depending on the context."
          />
          <Select
            value={formAlwaysOpenInMainWindow != null ? formAlwaysOpenInMainWindow : 'global'}
            onChange={(e) => {
              dispatch(updateForm({
                preferences: {
                  alwaysOpenInMainWindow: e.target.value !== 'global' ? e.target.value : null,
                },
              }));
            }}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
          >
            <MenuItem dense value="global">{`Use global preference (${alwaysOpenInMainWindow ? 'Yes' : 'No'})`}</MenuItem>
            <MenuItem dense value>Yes</MenuItem>
            <MenuItem dense value={false}>No</MenuItem>
          </Select>
        </ListItem>
      </List>
      <DialogInternalUrls />
      <DialogExternalUrls />
    </>
  );
};

export default SectionLinkHandling;
