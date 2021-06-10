/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogCodeInjection } from '../../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../../state/dialog-custom-user-agent/actions';

import DialogCodeInjection from '../../shared/dialog-code-injection';
import DialogCustomUserAgent from '../../shared/dialog-custom-user-agent';

const SectionDevelopers = ({
  cssCodeInjection,
  customUserAgent,
  jsCodeInjection,
  onOpenDialogCodeInjection,
  onOpenDialogCustomUserAgent,
  formCssCodeInjection,
  formCustomUserAgent,
  formJsCodeInjection,
}) => (
  <>
    <List disablePadding dense>
      <ListItem button onClick={onOpenDialogCustomUserAgent}>
        <ListItemText
          primary="Custom User Agent"
          secondary={(() => {
            if (formCustomUserAgent != null) {
              return formCustomUserAgent;
            }
            return `Use global preference (${customUserAgent || 'Not set'})`;
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
          primary="JS Code Injection"
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
          primary="CSS Code Injection"
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
};

SectionDevelopers.propTypes = {
  cssCodeInjection: PropTypes.string,
  customUserAgent: PropTypes.string,
  jsCodeInjection: PropTypes.string,
  onOpenDialogCodeInjection: PropTypes.func.isRequired,
  onOpenDialogCustomUserAgent: PropTypes.func.isRequired,
  formCustomUserAgent: PropTypes.string,
  formJsCodeInjection: PropTypes.string,
  formCssCodeInjection: PropTypes.string,
};

const mapStateToProps = (state) => ({
  cssCodeInjection: state.preferences.cssCodeInjection,
  customUserAgent: state.preferences.customUserAgent,
  jsCodeInjection: state.preferences.jsCodeInjection,
  formCssCodeInjection: state.dialogWorkspacePreferences.form.preferences.cssCodeInjection,
  formCustomUserAgent: state.dialogWorkspacePreferences.form.preferences.customUserAgent,
  formJsCodeInjection: state.dialogWorkspacePreferences.form.preferences.jsCodeInjection,
});

const actionCreators = {
  openDialogCodeInjection,
  openDialogCustomUserAgent,
};

export default connectComponent(
  SectionDevelopers,
  mapStateToProps,
  actionCreators,
);
