/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import {
  WithSearch,
  SearchBox as AppSearchSearchBox,
} from '@elastic/react-search-ui';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';

const SearchBox = () => (
  <Paper
    elevation={1}
    sx={{
      flex: 1,
      zIndex: 10,
      position: 'relative',
      borderRadius: 0,
      px: 1,
    }}
  >
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: 40,
        margin: '0 auto',
      }}
    >
      <Typography
        sx={{
          lineHeight: 1.5,
          py: 0,
          px: 0.5,
          flex: 1,
          userSelect: 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          transform: 'translateY(-1px)',
          fontWeight: 'normal',
        }}
        color="inherit"
        variant="body1"
        component="div"
      >
        <AppSearchSearchBox
          searchAsYouType
          debounceLength={300}
          inputView={({ getAutocomplete, getInputProps }) => (
            <Box className="sui-search-box__wrapper">
              <Box
                component="input"
                {...getInputProps({
                  sx: {
                    font: 'inherit',
                    border: '0 !important',
                    display: 'block',
                    verticalAlign: 'middle',
                    whiteSpace: 'normal',
                    background: 'none',
                    margin: 0,
                    color: (theme) => theme.palette.text.primary,
                    width: '100%',
                    padding: '0 !important',
                    boxShadow: 'none !important',
                    '&:focus': {
                      outline: 0,
                      border: 0,
                      boxShadow: 'none',
                    },
                    '&::placeholder': {
                      color: (theme) => theme.palette.text.secondary,
                    },
                  },
                  placeholder: 'Search apps...',
                  // App Search API can only handle up to 128 chars
                  maxLength: 128,
                  onFocus: () => {
                    window.preventClosingWindow = true;
                  },
                  onBlur: () => {
                    window.preventClosingWindow = false;
                  },
                })}
              />
              {getAutocomplete()}
            </Box>
          )}
          shouldClearFilters={false}
        />
      </Typography>
      <WithSearch
        mapContextToProps={({
          searchTerm,
          setSearchTerm,
          isLoading,
        }) => ({
          searchTerm,
          setSearchTerm,
          isLoading,
        })}
      >
        {({ searchTerm, setSearchTerm, isLoading }) => {
          if (searchTerm.length > 0) {
            return (
              <Tooltip title="Clear">
                <IconButton
                  color="default"
                  sx={{ p: 0.5 }}
                  aria-label="Clear"
                  onClick={() => setSearchTerm('', {
                    refresh: true,
                    debounce: 0,
                    shouldClearFilters: false,
                  })}
                  size="large"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          }
          return (
            <Tooltip title="Refresh">
              <IconButton
                color="default"
                sx={{ p: 0.5 }}
                aria-label="Refresh"
                onClick={() => {
                  // clear cache first
                  if (window.elasticAppSearchQueryCache) {
                    window.elasticAppSearchQueryCache.clear();
                  }
                  setSearchTerm('', {
                    refresh: true,
                    debounce: 0,
                  });
                }}
                disabled={isLoading}
                size="large"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }}
      </WithSearch>
    </Box>
  </Paper>
);

export default SearchBox;
