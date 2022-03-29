/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import roundTime from '../../../helpers/round-time';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
  requestShowReloadWorkspaceDialog,
} from '../../../senders';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';
import { open as openDialogRefreshInterval } from '../../../state/dialog-refresh-interval/actions';

import autoRefreshIntervals from '../../../constants/auto-refresh-intervals';

import DialogInternalUrls from '../../shared/dialog-internal-urls';
import DialogRefreshInterval from '../../shared/dialog-refresh-interval';

const SectionAutoReload = () => {
  const dispatch = useDispatch();

  const autoRefresh = useSelector((state) => state.preferences.autoRefresh);
  const autoRefreshInterval = useSelector((state) => state.preferences.autoRefreshInterval);
  const autoRefreshOnlyWhenInactive = useSelector(
    (state) => state.preferences.autoRefreshOnlyWhenInactive,
  );
  const formAutoRefresh = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.autoRefresh,
  );
  const formAutoRefreshInterval = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.autoRefreshInterval,
  );
  const formAutoRefreshOnlyWhenInactive = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.autoRefreshOnlyWhenInactive,
  );

  return (
    <>
      <List disablePadding dense>
        <ListItem>
          <ListItemText
            primary="Reload web pages automatically"
          />
          <Select
            value={formAutoRefresh != null ? formAutoRefresh : 'global'}
            onChange={(e) => {
              dispatch(updateForm({
                preferences: {
                  autoRefresh: e.target.value !== 'global' ? e.target.value : null,
                },
              }));
              const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
              requestShowReloadWorkspaceDialog(workspaceId);
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
            <MenuItem dense value="global">{`Use global preference (${autoRefresh ? 'Yes' : 'No'})`}</MenuItem>
            <MenuItem dense value>Yes</MenuItem>
            <MenuItem dense value={false}>No</MenuItem>
          </Select>
        </ListItem>
        {formAutoRefresh && (
          <>
            <ListItem>
              <ListItemText
                primary="Reload every"
                sx={{
                  '& .MuiListItemText-primary': {
                    float: 'right',
                    pr: 1,
                  },
                }}
              />
              <Select
                value={formAutoRefreshInterval || autoRefreshInterval}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    dispatch(openDialogRefreshInterval());
                    return;
                  }
                  dispatch(updateForm({
                    preferences: {
                      autoRefreshInterval: e.target.value,
                    },
                  }));
                  const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
                  requestShowReloadWorkspaceDialog(workspaceId);
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
                {autoRefreshIntervals.map((opt) => (
                  <MenuItem key={opt.value} dense value={opt.value}>{opt.name}</MenuItem>
                ))}
                {(() => {
                  const val = formAutoRefreshInterval || autoRefreshInterval;
                  const isCustom = autoRefreshIntervals
                    .find((interval) => interval.value === val) == null;
                  if (isCustom) {
                    const time = roundTime(val);
                    return (
                      <MenuItem dense value={val}>
                        {`${time.value} ${time.unit}`}
                      </MenuItem>
                    );
                  }
                  return null;
                })()}
                <MenuItem dense value="custom">Custom</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Only reload on inactivity"
                secondary={(
                  <>
                    <span>Keep certain apps from logging </span>
                    <span>out automatically when you are away. </span>
                    <Box
                      component="span"
                      role="link"
                      tabIndex={0}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 500,
                        outline: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                        '&:focus': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${getUtmSource()}`)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser(`https://docs.webcatalog.io/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${getUtmSource()}`);
                      }}
                    >
                      Learn more
                    </Box>
                    <span>.</span>
                  </>
                )}
              />
              <Select
                value={formAutoRefreshOnlyWhenInactive != null ? formAutoRefreshOnlyWhenInactive : 'global'}
                onChange={(e) => {
                  dispatch(updateForm({
                    preferences: {
                      autoRefreshOnlyWhenInactive: e.target.value !== 'global' ? e.target.value : null,
                    },
                  }));
                  const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
                  requestShowReloadWorkspaceDialog(workspaceId);
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
                <MenuItem dense value="global">{`Use global preference (${autoRefreshOnlyWhenInactive ? 'Yes' : 'No'})`}</MenuItem>
                <MenuItem dense value>Yes</MenuItem>
                <MenuItem dense value={false}>No</MenuItem>
              </Select>
            </ListItem>
          </>
        )}
      </List>
      <DialogInternalUrls />
      <DialogRefreshInterval />
    </>
  );
};

export default SectionAutoReload;
