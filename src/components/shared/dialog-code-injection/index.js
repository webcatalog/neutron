/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders';

import { updateForm, save, close } from '../../../state/dialog-code-injection/actions';

const styles = (theme) => ({
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

const CodeInjection = ({
  allowNodeInJsCodeInjection,
  classes,
  code,
  codeInjectionType,
  onClose,
  onSave,
  onUpdateForm,
  open,
  shouldUseDarkColors,
}) => (
  <Dialog
    onClose={onClose}
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
        onChange={(value) => onUpdateForm({ code: value })}
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
                    onChange={(e) => onUpdateForm({ allowNodeInJsCodeInjection: e.target.checked })}
                    color="primary"
                  />
                )}
                label="Allow access to Node.JS & Electron APIs"
              />
            </>
          )}
        </div>
        <div className={classes.actionsRight}>
          <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" disableElevation className={classes.button} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogActions>
  </Dialog>
);

CodeInjection.defaultProps = {
  allowNodeInJsCodeInjection: false,
  codeInjectionType: 'js',
  open: false,
};

CodeInjection.propTypes = {
  allowNodeInJsCodeInjection: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
  codeInjectionType: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
  shouldUseDarkColors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  allowNodeInJsCodeInjection: state.dialogCodeInjection.form.allowNodeInJsCodeInjection,
  code: state.dialogCodeInjection.form.code || '',
  codeInjectionType: state.dialogCodeInjection.codeInjectionType,
  open: state.dialogCodeInjection.open,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

const actionCreators = {
  close,
  save,
  updateForm,
};

export default connectComponent(
  CodeInjection,
  mapStateToProps,
  actionCreators,
  styles,
);
