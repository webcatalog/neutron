/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';

import { requestOpenInBrowser } from '../../../senders';

import { updateForm, save, close } from '../../../state/dialog-code-injection/actions';

const getMode = (codeInjectionType) => {
  if (codeInjectionType === 'css') return 'css';
  if (codeInjectionType === 'js') return 'javascript';
  return '';
};

const CodeInjection = () => {
  const dispatch = useDispatch();

  const allowNodeInJsCodeInjection = useSelector(
    (state) => state.dialogCodeInjection.form.allowNodeInJsCodeInjection,
  );
  const code = useSelector((state) => state.dialogCodeInjection.form.code || '');
  const codeInjectionType = useSelector((state) => state.dialogCodeInjection.codeInjectionType);
  const open = useSelector((state) => state.dialogCodeInjection.open);
  const shouldUseDarkColors = useSelector((state) => state.general.shouldUseDarkColors);
  return (
    <Dialog
      onClose={() => dispatch(close())}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent
        sx={{
          height: 400,
          pt: 2.5,
          pb: 0,
          px: 0,
        }}
      >
        <AceEditor
          mode={getMode(codeInjectionType)}
          theme={shouldUseDarkColors ? 'monokai' : 'github'}
          height="100%"
          width="100%"
          name="codeEditor"
          value={code}
          onChange={(value) => dispatch(updateForm({ code: value }))}
        />
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            {codeInjectionType === 'js' && (
              <>
                <Button variant="text" color="inherit" onClick={() => requestOpenInBrowser('https://github.com/webcatalog/webcatalog-app/wiki/WebCatalog-APIs')}>
                  WebCatalog API Documentation
                </Button>
                <FormControlLabel
                  control={(
                    <Switch
                      checked={allowNodeInJsCodeInjection}
                      onChange={(e) => dispatch(
                        updateForm({ allowNodeInJsCodeInjection: e.target.checked }),
                      )}
                      color="primary"
                    />
                  )}
                  label="Allow access to Node.JS & Electron APIs"
                />
              </>
            )}
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
              onClick={() => dispatch(save())}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                float: 'right',
                ml: 1,
                ':hover': {
                  bgcolor: 'rgb(0 0 0 / 16%)',
                },
              }}
              disableElevation
              onClick={() => dispatch(close())}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CodeInjection;
