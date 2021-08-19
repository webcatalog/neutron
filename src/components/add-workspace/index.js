/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Paper from '@material-ui/core/Paper';

import ViewListIcon from '@material-ui/icons/ViewList';
import CreateIcon from '@material-ui/icons/Create';

import connectComponent from '../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import { updateMode } from '../../state/dialog-add-workspace/actions';

import Home from './home';
import Form from './form';

const styles = () => ({
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
  bottomNavigationActionWrapper: {
    flexDirection: 'row',
  },
  bottomNavigationActionLabel: {
    fontSize: '0.8rem !important',
    paddingLeft: 4,
  },
});

const AddWorkspace = ({
  classes,
  mode,
  onUpdateMode,
}) => (
  <div className={classes.root}>
    {mode === 'catalog' && <Home />}
    {mode === 'custom' && <Form />}

    <Paper elevation={1} square className={classes.paper}>
      <BottomNavigation
        showLabels
        value={mode}
        onChange={(e, value) => {
          // custom workspace is disabled in free version of Singlebox
          onUpdateMode(value);
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
      </BottomNavigation>
    </Paper>
  </div>
);

AddWorkspace.propTypes = {
  classes: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  onUpdateMode: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  mode: state.dialogAddWorkspace.mode,
});

const actionCreators = {
  updateMode,
};

export default connectComponent(
  AddWorkspace,
  mapStateToProps,
  actionCreators,
  styles,
);
