/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import amplitude from '../../amplitude';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';
import extractHostname from '../../helpers/extract-hostname';
import { requestCreateWorkspace, requestTrackAddWorkspace } from '../../senders';

import { updateForm, updateMode } from '../../state/dialog-add-workspace/actions';

const styles = (theme) => ({
  card: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    marginTop: theme.spacing(1),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  actionButton: {
    minWidth: 'auto',
    marginLeft: theme.spacing(1),
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flex: 1,
    overflow: 'hidden',
  },
});

const AppCard = (props) => {
  const {
    classes,
    icon,
    icon128,
    id,
    name,
    onUpdateForm,
    onUpdateMode,
    url,
  } = props;

  return (
    <Paper elevation={0} className={classes.card} square>
      <img
        alt={name}
        className={classes.paperIcon}
        src={icon128 || (isUrl(icon) ? icon : `file://${icon}`)}
      />
      <div className={classes.infoContainer}>
        <Typography variant="subtitle2" className={classes.appName}>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.appUrl}>
          {extractHostname(url)}
        </Typography>
      </div>
      <div className={classes.actionContainer}>
        <IconButton
          size="small"
          aria-label="More"
          className={classes.topRight}
          onClick={() => {
            const template = [
              {
                label: 'Clone',
                click: () => {
                  onUpdateForm({
                    name, homeUrl: url, internetIcon: icon,
                  });
                  onUpdateMode('custom');
                },
              },
            ];
            const menu = window.remote.Menu.buildFromTemplate(template);
            menu.popup(window.remote.getCurrentWindow());
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Button
          className={classes.actionButton}
          color="primary"
          size="small"
          variant="contained"
          disableElevation
          onClick={() => {
            // only track installs for apps in the catalog
            // tracking is only for ranking purpose
            requestTrackAddWorkspace(amplitude.getInstance().options.deviceId, id);

            requestCreateWorkspace({
              name,
              homeUrl: url,
              picture: icon,
              catalogId: id,
              tabs: {
                '0': {
                  homeUrl: url,
                  lastUrl: url
                },
              }
            });

            window.remote.getCurrentWindow().close();
          }}
        >
          Add
        </Button>
      </div>
    </Paper>
  );
};

AppCard.defaultProps = {
  icon128: null,
};

AppCard.propTypes = {
  classes: PropTypes.object.isRequired,
  icon128: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  onUpdateMode: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

const actionCreators = {
  updateForm,
  updateMode,
};

export default connectComponent(
  AppCard,
  null,
  actionCreators,
  styles,
);
