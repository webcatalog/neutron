/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

import { open as openDialogCodeInjection } from '../../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../../state/dialog-custom-user-agent/actions';

import DialogCodeInjection from '../../shared/dialog-code-injection';
import DialogCustomUserAgent from '../../shared/dialog-custom-user-agent';

const SectionDevelopers = () => {
  const dispatch = useDispatch();

  const forceMobileView = useSelector((state) => state.preferences.forceMobileView);
  const cssCodeInjection = useSelector((state) => state.preferences.cssCodeInjection);
  const customUserAgent = useSelector((state) => state.preferences.customUserAgent);
  const jsCodeInjection = useSelector((state) => state.preferences.jsCodeInjection);
  const formCssCodeInjection = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.cssCodeInjection,
  );
  const formCustomUserAgent = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.customUserAgent,
  );
  const formJsCodeInjection = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.jsCodeInjection,
  );
  const formForceMobileView = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.forceMobileView,
  );
  return (
    <>
      <List disablePadding dense>
        <ListItem>
          <ListItemText
            primary="Force mobile view"
            secondary="Force some websites to use their mobile versions by using mobile User-Agent string."
          />
          <Select
            value={formForceMobileView != null ? formForceMobileView : 'global'}
            onChange={(e) => {
              dispatch(updateForm({
                preferences: {
                  forceMobileView: e.target.value !== 'global' ? e.target.value : null,
                },
              }));
            }}
            variant="filled"
            disableUnderline
            margin="dense"
            sx={{
              borderRadius: 0.5,
              fontSize: '0.84375rem',
              '& .MuiSelect-select': {
                py: 1,
                pr: 3.25,
                pl: 1.5,
              },
              py: 1,
            }}
          >
            <MenuItem dense value="global">{`Use global preference (${forceMobileView ? 'Yes' : 'No'})`}</MenuItem>
            <MenuItem dense value>Yes</MenuItem>
            <MenuItem dense value={false}>No</MenuItem>
          </Select>
        </ListItem>
        <ListItem
          button
          onClick={() => dispatch(openDialogCustomUserAgent())}
          disabled={formForceMobileView != null ? formForceMobileView : forceMobileView}
        >
          <ListItemText
            primary="Custom User-Agent string"
            secondary={(() => {
              const showMobileUA = formForceMobileView != null
                ? formForceMobileView : forceMobileView;
              if (showMobileUA) {
                return 'Chrome (Android) UA string';
              }
              if (formCustomUserAgent != null) {
                return formCustomUserAgent;
              }
              return `Use global preference (${forceMobileView ? 'Chrome (Android) UA string' : (customUserAgent || 'Not set')})`;
            })()}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            dispatch(openDialogCodeInjection('js'));
          }}
        >
          <ListItemText
            primary="JS code injection"
            secondary={(() => {
              if (formJsCodeInjection != null) {
                return formJsCodeInjection;
              }
              return `Use global preference (${jsCodeInjection || 'Not set'})`;
            })()}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            dispatch(openDialogCodeInjection('css'));
          }}
        >
          <ListItemText
            primary="CSS code injection"
            secondary={(() => {
              if (formCssCodeInjection != null) {
                return formCssCodeInjection;
              }
              return `Use global preference (${cssCodeInjection || 'Not set'})`;
            })()}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>
      <DialogCodeInjection />
      <DialogCustomUserAgent />
    </>
  );
};

export default SectionDevelopers;
