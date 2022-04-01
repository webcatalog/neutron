/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useCallback } from 'react';

import Button from '@mui/material/Button';

import { SnackbarProvider } from 'notistack';

import Inner from './inner';

const SnackbarTrigger = () => {
  const notistackRef = useRef(null);
  const action = useCallback((key) => {
    const onClickDismiss = () => {
      notistackRef.current.closeSnackbar(key);
    };

    return (
      <Button color="inherit" onClick={onClickDismiss}>
        Dismiss
      </Button>
    );
  }, [notistackRef]);

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      dense
      preventDuplicate
      sx={{ mt: 1 }}
      action={action}
    >
      <Inner />
    </SnackbarProvider>
  );
};

export default SnackbarTrigger;
