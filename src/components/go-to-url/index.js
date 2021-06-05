/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import connectComponent from '../../helpers/connect-component';

import { updateForm, go } from '../../state/dialog-go-to-url/actions';

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
});

const GoToUrl = ({
  classes, url, urlError, onUpdateForm, onGo,
}) => (
  <div className={classes.root}>
    <div className={classes.flexGrow}>
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
        onChange={(e) => onUpdateForm({ url: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onGo();
            e.target.blur();
          }
        }}
      />
    </div>
    <div>
      <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={onGo}>
        Go
      </Button>
      <Button variant="contained" disableElevation className={classes.button} onClick={() => window.remote.getCurrentWindow().close()}>
        Cancel
      </Button>
    </div>
  </div>
);

GoToUrl.defaultProps = {
  urlError: null,
};

GoToUrl.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  urlError: PropTypes.string,
  onUpdateForm: PropTypes.func.isRequired,
  onGo: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  url: state.dialogGoToUrl.form.url,
  urlError: state.dialogGoToUrl.form.urlError,
});

const actionCreators = {
  updateForm,
  go,
};

export default connectComponent(
  GoToUrl,
  mapStateToProps,
  actionCreators,
  styles,
);
