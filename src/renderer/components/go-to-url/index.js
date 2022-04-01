/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { getCurrentWindow } from '@electron/remote';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

import { updateForm, go } from '../../state/dialog-go-to-url/actions';

const GoToUrl = () => {
  const dispatch = useDispatch();

  const urlError = useSelector((state) => state.dialogGoToUrl.urlError);
  const url = useSelector((state) => state.dialogGoToUrl.url);

  return (
    <Box
      sx={{
        background: 'background.paper',
        height: 1,
        width: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <TextField
          autoFocus
          label="URL"
          error={Boolean(urlError)}
          helperText={urlError}
          placeholder="Type a URL"
          fullWidth
          margin="dense"
          variant="outlined"
          multiline={false}
          InputLabelProps={{
            shrink: true,
          }}
          value={url}
          onChange={(e) => dispatch(updateForm({ url: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              dispatch(go());
              e.target.blur();
            }
          }}
        />
      </Box>
      <Box>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          sx={{
            float: 'right',
            ml: 1,
          }}
          onClick={() => dispatch(go())}
        >
          Go
        </Button>
        <Button
          variant="contained"
          disableElevation
          sx={{
            float: 'right',
            ml: 1,
          }}
          onClick={() => getCurrentWindow().close()}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default GoToUrl;
