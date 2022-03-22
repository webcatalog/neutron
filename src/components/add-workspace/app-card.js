/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useDispatch } from 'react-redux';

import amplitude from '../../amplitude';

import isUrl from '../../helpers/is-url';
import extractHostname from '../../helpers/extract-hostname';
import { requestCreateWorkspace, requestTrackAddWorkspace } from '../../senders';

import { updateForm, updateMode } from '../../state/dialog-add-workspace/actions';

const PREFIX = 'AppCard';

const classes = {
  card: `${PREFIX}-card`,
  appName: `${PREFIX}-appName`,
  appUrl: `${PREFIX}-appUrl`,
  paperIcon: `${PREFIX}-paperIcon`,
  actionContainer: `${PREFIX}-actionContainer`,
  actionButton: `${PREFIX}-actionButton`,
  infoContainer: `${PREFIX}-infoContainer`,
};

const StyledPaper = styled(Paper)((
  {
    theme,
  },
) => ({
  [`&.${classes.card}`]: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    marginTop: theme.spacing(1),
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },

  [`& .${classes.appName}`]: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },

  [`& .${classes.appUrl}`]: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  [`& .${classes.paperIcon}`]: {
    width: 40,
    height: 40,
    borderRadius: 8,
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },

  [`& .${classes.actionContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },

  [`& .${classes.actionButton}`]: {
    minWidth: 'auto',
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.infoContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flex: 1,
    overflow: 'hidden',
  },
}));

const AppCard = (props) => {
  const {
    icon,
    icon128,
    id,
    name,
    requireInstanceUrl,
    url,
  } = props;

  const dispatch = useDispatch();

  return (
    <StyledPaper elevation={0} className={classes.card} square>
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
                  dispatch(updateForm({
                    name, homeUrl: url, internetIcon: icon,
                  }));
                  dispatch(updateMode('custom'));
                },
              },
            ];
            const menu = window.remote.Menu.buildFromTemplate(template);
            menu.popup({
              window: window.remote.getCurrentWindow(),
            });
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
            // if the app requires instance URL
            // user has to configure the app URL before adding workspace
            if (requireInstanceUrl) {
              dispatch(updateForm({
                name, homeUrl: url, internetIcon: icon,
              }));
              dispatch(updateMode('custom'));
              return;
            }

            // only track installs for apps in the catalog
            // tracking is only for ranking purpose
            requestTrackAddWorkspace(amplitude.getInstance().options.deviceId, id);

            requestCreateWorkspace({
              name,
              homeUrl: url,
              picture: icon,
              catalogId: id,
            });

            window.remote.getCurrentWindow().close();
          }}
        >
          Add
        </Button>
      </div>
    </StyledPaper>
  );
};

AppCard.defaultProps = {
  icon128: null,
  requireInstanceUrl: false,
};

AppCard.propTypes = {
  icon128: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  requireInstanceUrl: PropTypes.bool,
  url: PropTypes.string.isRequired,
};

export default AppCard;
