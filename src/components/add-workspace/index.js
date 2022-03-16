/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Paper from '@material-ui/core/Paper';

import ViewListIcon from '@material-ui/icons/ViewList';
import CreateIcon from '@material-ui/icons/Create';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import { updateMode } from '../../state/dialog-add-workspace/actions';

import {
  requestShowAppMiniMenu,
} from '../../senders';

import Home from './home';
import Form from './form';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  paper: {
    zIndex: 1,
  },
  bottomNavigation: {
    height: 40,
  },
  bottomNavigationActionRootSmall: {
    flex: 0,
  },
  bottomNavigationActionWrapper: {
    flexDirection: 'row',
  },
  bottomNavigationActionLabel: {
    fontSize: '0.8rem !important',
    paddingLeft: 4,
  },
}));

const AddWorkspace = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.dialogAddWorkspace.mode);

  return (
    <div className={classes.root}>
      {mode === 'catalog' && <Home />}
      {mode === 'custom' && <Form />}

      <Paper elevation={1} square className={classes.paper}>
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
          classes={{ root: classes.bottomNavigation }}
        >
          <BottomNavigationAction
            label="Catalog"
            value="catalog"
            icon={<ViewListIcon />}
            classes={{
              wrapper: classes.bottomNavigationActionWrapper,
              label: classes.bottomNavigationActionLabel,
            }}
          />
          <BottomNavigationAction
            label={`Custom ${getWorkspaceFriendlyName()}`}
            value="custom"
            icon={<CreateIcon />}
            classes={{
              wrapper: classes.bottomNavigationActionWrapper,
              label: classes.bottomNavigationActionLabel,
            }}
          />
          <BottomNavigationAction
            value="more"
            icon={<MoreVertIcon />}
            classes={{
              root: classes.bottomNavigationActionRootSmall,
              wrapper: classes.bottomNavigationActionWrapper,
              label: classes.bottomNavigationActionLabel,
            }}
            onClick={(e) => {
              requestShowAppMiniMenu(e.x, e.y);
            }}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
};

export default AddWorkspace;
