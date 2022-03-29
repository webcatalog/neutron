/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import themeColors from '../../../constants/theme-colors';

const Tab = ({
  active, onClose, onSelect, name,
}) => (
  <Box
    role="button"
    tabIndex={0}
    sx={[
      {
        flex: 1,
        maxWidth: 30,
        display: 'flex',
        flexDirection: 'row',
        pl: 2,
        pr: 1,
        borderRight: (props) => {
          if (props.themeColor != null) {
            return `1px solid ${themeColors[props.themeColor][800]}`;
          }
          return (theme) => `1px solid ${theme.palette.background.paper}`;
        },
        WebkitAppRegion: 'no-drag',
      },
      active && {
        borderRight: 'none',
        bgcolor: (props) => {
          if (props.themeColor != null) {
            return themeColors[props.themeColor][800];
          }
          return (theme) => theme.palette.background.paper;
        },
      },
    ]}
    onClick={onSelect ? () => onSelect() : undefined}
    onKeyDown={onSelect ? (e) => {
      if (e.key === 'Enter') {
        onSelect();
      }
    } : undefined}
  >
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      {name || 'Tab'}
    </Box>
    {onClose && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pl: 0.5,
        }}
      >
        <IconButton
          size="small"
          onClick={() => onClose()}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    )}
  </Box>
);

Tab.defaultProps = {
  active: false,
  themeColor: undefined,
  onClose: undefined,
  onSelect: undefined,
  name: undefined,
};

Tab.propTypes = {
  active: PropTypes.bool,
  name: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  themeColor: PropTypes.string,
};

export default Tab;
