/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { useDispatch, useSelector } from 'react-redux';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';

import { requestOpenInBrowser } from '../../../senders';

import { updateForm, save, close } from '../../../state/dialog-code-injection/actions';

const useStyles = (theme) => ({
  content: {
    height: theme.spacing(50),
    padding: 0,
  },
  actions: {
    display: 'flex',
  },
  actionsLeft: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
});

const getMode = (codeInjectionType) => {
  if (codeInjectionType === 'css') return 'css';
  if (codeInjectionType === 'js') return 'javascript';
  return '';
};

const CodeInjection = () => {
  const classes = useStyles();
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
      <DialogContent className={classes.content}>
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
        <div className={classes.actions}>
          <div className={classes.actionsLeft}>
            {codeInjectionType === 'js' && (
              <>
                <Button variant="text" onClick={() => requestOpenInBrowser('https://github.com/webcatalog/webcatalog-app/wiki/WebCatalog-APIs')}>
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
          </div>
          <div className={classes.actionsRight}>
            <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={() => dispatch(save())}>
              Save
            </Button>
            <Button variant="contained" disableElevation className={classes.button} onClick={() => dispatch(close())}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default CodeInjection;
