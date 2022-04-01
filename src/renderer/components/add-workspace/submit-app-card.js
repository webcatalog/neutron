/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box } from '@mui/material';

import { requestOpenInBrowser } from '../../senders';

const SubmitAppCard = () => (
  <Grid item xs={12}>
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: 1,
        p: 1.5,
        display: 'flex',
        cursor: 'pointer',
        color: 'text.primary',
        border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'),
        '&:hover, &:focus': {
          bgcolor: 'action.selected',
        },
        textAlign: 'left',
        mt: 2,
      }}
      onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog/apps/submit/')}
    >
      <Box>
        <AddCircleIcon sx={{ fontSize: '64px' }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 1,
          flex: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          Submit New Service
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
          Can&apos;t find your favorite app/service? Submit it!
        </Typography>
      </Box>
    </Paper>
  </Grid>
);

export default SubmitAppCard;
