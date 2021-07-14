/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../helpers/connect-component';
import getWorkspacesAsList from '../../helpers/get-workspaces-as-list';
import getMailtoUrl from '../../helpers/get-mailto-url';
import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import { requestLoadUrl } from '../../senders';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    overflow: 'auto',
  },
  checkboxContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    userSelect: 'none',
  },
}));

const OpenUrlWith = ({ workspaces, defaultOpenInNewWindow }) => {
  const classes = useStyles();

  const appJson = getStaticGlobal('appJson');
  const incomingUrl = getStaticGlobal('incomingUrl');
  const isMailtoUrl = incomingUrl.startsWith('mailto:');

  const [openInNewWindow, setOpenInNewWindow] = useState(defaultOpenInNewWindow);

  const renderWorkspace = (workspace, i) => {
    if (isMailtoUrl && !getMailtoUrl(workspace.homeUrl || appJson.url)) return null;

    const fullName = (() => {
      if (workspace.name) return workspace.name;
      if (workspace.accountInfo) {
        if (workspace.accountInfo.name && workspace.accountInfo.email) {
          return `${workspace.accountInfo.name} (${workspace.accountInfo.email})`;
        }
        if (workspace.accountInfo.name) {
          return workspace.accountInfo.name;
        }
      }
      return `${getWorkspaceFriendlyName()} ${i + 1}`;
    })();

    return (
      <ListItem
        button
        onClick={() => {
          const u = isMailtoUrl ? getMailtoUrl(workspace.homeUrl || appJson.url).replace('%s', incomingUrl) : incomingUrl;

          requestLoadUrl(u, workspace.id, openInNewWindow);
          window.remote.getCurrentWindow().close();
        }}
      >
        <ListItemText
          primary={fullName}
          secondary={`#${i + 1}`}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    );
  };

  return (
    <div className={classes.root}>
      <List dense className={classes.list} component="div">
        {getWorkspacesAsList(workspaces).map(renderWorkspace)}
      </List>
      <Divider />
      <div className={classes.checkboxContainer}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={openInNewWindow}
              onChange={(e) => setOpenInNewWindow(e.target.checked)}
              name="checkedB"
              color="primary"
            />
          )}
          label="Open in new window"
        />
      </div>
    </div>
  );
};

OpenUrlWith.propTypes = {
  workspaces: PropTypes.object.isRequired,
  defaultOpenInNewWindow: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  workspaces: state.workspaces.workspaces,
  defaultOpenInNewWindow: state.preferences.openProtocolUrlInNewWindow === 'new-window',
});

export default connectComponent(
  OpenUrlWith,
  mapStateToProps,
  null,
  null,
);
