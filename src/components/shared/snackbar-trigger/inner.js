/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

import Button from '@material-ui/core/Button';

import { useSnackbar } from 'notistack';

import {
  requestRestart,
} from '../../../senders';

const SnackbarTriggerInner = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    ipcRenderer.removeAllListeners('enqueue-snackbar');
    ipcRenderer.on('enqueue-snackbar', (_, message, variant) => {
      enqueueSnackbar(message, { variant, autoHideDuration: 10000 });
    });
    return () => {
      ipcRenderer.removeAllListeners('enqueue-snackbar');
    };
  }, [enqueueSnackbar]);

  const showRequestRestartSnackbar = useCallback(() => {
    enqueueSnackbar('You need to restart the app for the changes to take effect.', {
      variant: 'default',
      preventDuplicate: true,
      persist: true,
      action: (key) => (
        <>
          <Button color="inherit" onClick={() => requestRestart()}>
            Restart Now
          </Button>
          <Button color="inherit" onClick={() => closeSnackbar(key)}>
            Later
          </Button>
        </>
      ),
    });
  }, [enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('enqueue-request-restart-snackbar');
    ipcRenderer.on('enqueue-request-restart-snackbar', showRequestRestartSnackbar);
    return () => {
      ipcRenderer.removeAllListeners('enqueue-request-restart-snackbar');
    };
  }, [showRequestRestartSnackbar]);

  return null;
};

export default SnackbarTriggerInner;
