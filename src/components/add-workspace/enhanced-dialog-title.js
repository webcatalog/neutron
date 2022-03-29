/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import MuiDialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const EnhancedDialogTitle = ({ children, onClose }) => (
  <MuiDialogTitle
    disableTypography
    sx={{
      borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      mt: 0,
      mb: 3,
      p: 0,
    }}
  >
    <Typography variant="h6">{children}</Typography>
    {onClose ? (
      <IconButton
        aria-label="Close"
        sx={{
          position: 'absolute',
          right: 1,
          top: 1,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={onClose}
        size="large"
      >
        <CloseIcon />
      </IconButton>
    ) : null}
  </MuiDialogTitle>
);

EnhancedDialogTitle.defaultProps = {
  onClose: null,
};

EnhancedDialogTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  onClose: PropTypes.func,
};

export default EnhancedDialogTitle;
