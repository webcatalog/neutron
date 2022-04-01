/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const EmptyState = ({
  children,
  icon,
  title,
}) => {
  const Icon = icon;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: 1,
      }}
    >
      <Icon
        sx={{
          height: 112,
          width: 112,
        }}
        color="disabled"
      />
      <br />
      {title && (
        <Typography
          sx={{ mb: 1 }}
          variant="h6"
        >
          {title}
        </Typography>
      )}
      {typeof children === 'string' ? (
        <Typography
          variant="subtitle1"
          align="center"
        >
          {children}
        </Typography>
      ) : children}
    </Box>
  );
};

EmptyState.defaultProps = {
  children: null,
  title: null,
};

EmptyState.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
  ]),
  icon: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default EmptyState;
