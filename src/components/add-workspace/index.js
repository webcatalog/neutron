/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

// import makeStyles from '@mui/styles/makeStyles';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';

import ViewListIcon from '@mui/icons-material/ViewList';
import CreateIcon from '@mui/icons-material/Create';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Box } from '@mui/material';

import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import { updateMode } from '../../state/dialog-add-workspace/actions';

import {
  requestShowAppMiniMenu,
} from '../../senders';

import Home from './home';
import Form from './form';

const AddWorkspace = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.dialogAddWorkspace.mode);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {mode === 'catalog' && <Home />}
      {mode === 'custom' && <Form />}

      <Paper
        elevation={1}
        square
        sx={{ zIndex: 1 }}
      >
        <BottomNavigation
          showLabels
          value={mode}
          onChange={(e, value) => {
            if (value === 'more') {
              return;
            }
            // custom workspace is disabled in free version of Singlebox
            dispatch(updateMode(value));
          }}
          sx={{ height: 40 }}
        >
          <BottomNavigationAction
            label="Catalog"
            value="catalog"
            icon={<ViewListIcon />}
            sx={{
              '& .MuiBottomNavigationAction-wrapper': { flexDirection: 'row' },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.8rem !important',
                pl: 0.5,
              },
            }}
          />
          <BottomNavigationAction
            label={`Custom ${getWorkspaceFriendlyName()}`}
            value="custom"
            icon={<CreateIcon />}
            sx={{
              '& .MuiBottomNavigationAction-wrapper': { flexDirection: 'row' },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.8rem !important',
                pl: 0.5,
              },
            }}
          />
          <BottomNavigationAction
            value="more"
            icon={<MoreVertIcon />}
            sx={{
              flex: 0,
              '& .MuiBottomNavigationAction-wrapper': { flexDirection: 'row' },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.8rem !important',
                pl: 0.5,
              },
            }}
            onClick={(e) => {
              requestShowAppMiniMenu(e.x, e.y);
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default AddWorkspace;
