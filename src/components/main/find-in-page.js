/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Input } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { closeFindInPage, updateFindInPageText } from '../../state/find-in-page/actions';

import {
  requestFindInPage,
  requestStopFindInPage,
} from '../../senders';

const FindInPage = () => {
  const dispatch = useDispatch();

  const activeMatch = useSelector((state) => state.findInPage.activeMatch);
  const matches = useSelector((state) => state.findInPage.matches);
  const open = useSelector((state) => state.findInPage.open);
  const text = useSelector((state) => state.findInPage.text);

  const inputRef = useRef(null);
  // https://stackoverflow.com/a/57556594
  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const handleOpenFindInPage = useCallback(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, [inputRef]);
  useEffect(() => {
    ipcRenderer.on('open-find-in-page', handleOpenFindInPage);
    // Remove event listener on cleanup
    return () => {
      ipcRenderer.removeListener('open-find-in-page', handleOpenFindInPage);
    };
  }, [handleOpenFindInPage]);

  if (!open) return null;

  return (
    <Box
      sx={{
        background: 'background.default',
        display: 'flex',
        alignItems: 'center',
        py: 0,
        px: 0.5,
        zIndex: 1,
        height: 41, // need to have fixed height
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
        width: 1,
      }}
    >
      <Box
        sx={{
          flex: 1,
          py: 0,
          px: 1.5,
        }}
      >
        <Typography variant="body2">
          <strong>{activeMatch}</strong>
          <span> / </span>
          <strong>{matches}</strong>
          <span> matches</span>
        </Typography>
      </Box>
      <Box>
        <Input
          inputRef={inputRef}
          placeholder="Find"
          value={text}
          margin="dense"
          onChange={(e) => {
            const val = e.target.value;
            dispatch(updateFindInPageText(val));
            if (val.length > 0) {
              requestFindInPage(val, true);
            } else {
              requestStopFindInPage();
            }
          }}
          onInput={(e) => {
            const val = e.target.value;
            dispatch(updateFindInPageText(val));
            if (val.length > 0) {
              requestFindInPage(val, true);
            } else {
              requestStopFindInPage();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { // Enter
              const val = e.target.value;
              if (val.length > 0) {
                requestFindInPage(val, true);
              }
            }
            if (e.key === 'Escape') { // Escape
              requestStopFindInPage(true);
              dispatch(closeFindInPage());
            }
          }}
        />
      </Box>
      <Button
        color="inherit"
        size="small"
        disabled={text.length < 1 || matches < 1}
        onClick={() => {
          if (text.length > 0) {
            requestFindInPage(text, false);
          }
        }}
      >
        Previous
      </Button>
      <Button
        color="inherit"
        size="small"
        disabled={text.length < 1 || matches < 1}
        onClick={() => {
          if (text.length > 0) {
            requestFindInPage(text, true);
          }
        }}
      >
        Next
      </Button>
      <Button
        color="inherit"
        size="small"
        disabled={text.length < 1}
        onClick={() => {
          if (text.length > 0) {
            requestFindInPage(text, true);
          }
        }}
      >
        Find
      </Button>
      <Button
        color="inherit"
        size="small"
        onClick={() => {
          requestStopFindInPage(true);
          dispatch(closeFindInPage());
        }}
      >
        Close
      </Button>
    </Box>
  );
};

export default FindInPage;
