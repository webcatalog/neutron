/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';
import connectComponent from '../../../helpers/connect-component';

import { open as openDialogCodeInjection } from '../../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../../state/dialog-custom-user-agent/actions';

import DialogCodeInjection from '../../shared/dialog-code-injection';
import DialogCustomUserAgent from '../../shared/dialog-custom-user-agent';

const styles = (theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const SectionDevelopers = ({
  classes,
  cssCodeInjection,
  customUserAgent,
  forceMobileView,
  formCssCodeInjection,
  formCustomUserAgent,
  formForceMobileView,
  formJsCodeInjection,
  jsCodeInjection,
  onOpenDialogCodeInjection,
  onOpenDialogCustomUserAgent,
  onUpdateForm,
}) => (
  <>
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Force mobile view"
          secondary="Force some websites to use their mobile versions by using mobile User-Agent string."
        />
        <Select
          value={formForceMobileView != null ? formForceMobileView : 'global'}
          onChange={(e) => {
            onUpdateForm({
              preferences: {
                forceMobileView: e.target.value !== 'global' ? e.target.value : null,
              },
            });
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
        >
          <MenuItem dense value="global">{`Use global preference (${forceMobileView ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value>Yes</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
      <ListItem
        button
        onClick={onOpenDialogCustomUserAgent}
        disabled={formForceMobileView != null ? formForceMobileView : forceMobileView}
      >
        <ListItemText
          primary="Custom User-Agent string"
          secondary={(() => {
            const showMobileUA = formForceMobileView != null
              ? formForceMobileView : forceMobileView;
            if (showMobileUA) {
              return 'Chrome (Android) UA string';
            }
            if (formCustomUserAgent != null) {
              return formCustomUserAgent;
            }
            return `Use global preference (${forceMobileView ? 'Chrome (Android) UA string' : (customUserAgent || 'Not set')})`;
          })()}
          secondaryTypographyProps={{ noWrap: true }}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => {
          onOpenDialogCodeInjection('js');
        }}
      >
        <ListItemText
          primary="JS code injection"
          secondary={(() => {
            if (formJsCodeInjection != null) {
              return formJsCodeInjection;
            }
            return `Use global preference (${jsCodeInjection || 'Not set'})`;
          })()}
          secondaryTypographyProps={{ noWrap: true }}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => {
          onOpenDialogCodeInjection('css');
        }}
      >
        <ListItemText
          primary="CSS code injection"
          secondary={(() => {
            if (formCssCodeInjection != null) {
              return formCssCodeInjection;
            }
            return `Use global preference (${cssCodeInjection || 'Not set'})`;
          })()}
          secondaryTypographyProps={{ noWrap: true }}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
    <DialogCodeInjection />
    <DialogCustomUserAgent />
  </>
);

SectionDevelopers.defaultProps = {
  cssCodeInjection: null,
  customUserAgent: null,
  jsCodeInjection: null,
  formCssCodeInjection: null,
  formCustomUserAgent: null,
  formJsCodeInjection: null,
  formForceMobileView: null,
};

SectionDevelopers.propTypes = {
  classes: PropTypes.object.isRequired,
  cssCodeInjection: PropTypes.string,
  customUserAgent: PropTypes.string,
  forceMobileView: PropTypes.bool.isRequired,
  formCssCodeInjection: PropTypes.string,
  formCustomUserAgent: PropTypes.string,
  formForceMobileView: PropTypes.bool,
  formJsCodeInjection: PropTypes.string,
  jsCodeInjection: PropTypes.string,
  onOpenDialogCodeInjection: PropTypes.func.isRequired,
  onOpenDialogCustomUserAgent: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  forceMobileView: state.preferences.forceMobileView,
  cssCodeInjection: state.preferences.cssCodeInjection,
  customUserAgent: state.preferences.customUserAgent,
  jsCodeInjection: state.preferences.jsCodeInjection,
  formCssCodeInjection: state.dialogWorkspacePreferences.form.preferences.cssCodeInjection,
  formCustomUserAgent: state.dialogWorkspacePreferences.form.preferences.customUserAgent,
  formJsCodeInjection: state.dialogWorkspacePreferences.form.preferences.jsCodeInjection,
  formForceMobileView: state.dialogWorkspacePreferences.form.preferences.forceMobileView,
});

const actionCreators = {
  updateForm,
  openDialogCodeInjection,
  openDialogCustomUserAgent,
};

export default connectComponent(
  SectionDevelopers,
  mapStateToProps,
  actionCreators,
  styles,
);
