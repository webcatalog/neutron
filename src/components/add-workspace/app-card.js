/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
import React from 'react';
import { Menu, getCurrentWindow } from '@electron/remote';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';

import { useDispatch } from 'react-redux';

import amplitude from '../../amplitude';

import isUrl from '../../helpers/is-url';
import extractHostname from '../../helpers/extract-hostname';
import { requestCreateWorkspace, requestTrackAddWorkspace } from '../../senders';

import { updateForm, updateMode } from '../../state/dialog-add-workspace/actions';

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
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        px: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 52,
        mt: 1,
        border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'),
      }}
      square
    >
      <Box
        component="img"
        alt={name}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'),
        }}
        src={icon128 || (isUrl(icon) ? icon : `file://${icon}`)}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 1,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontWeight: 500,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {extractHostname(url)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          pl: 1,
        }}
      >
        <IconButton
          size="small"
          aria-label="More"
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
            const menu = Menu.buildFromTemplate(template);
            menu.popup({
              window: getCurrentWindow(),
            });
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Button
          sx={{
            minWidth: 'auto',
            ml: 1,
          }}
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

            getCurrentWindow().close();
          }}
        >
          Add
        </Button>
      </Box>
    </Paper>
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
