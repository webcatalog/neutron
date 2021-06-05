/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import {
  WithSearch,
  SearchBox as AppSearchSearchBox,
} from '@elastic/react-search-ui';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  toolbarSearchContainer: {
    flex: 1,
    zIndex: 10,
    position: 'relative',
    borderRadius: 0,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    margin: '0 auto',
  },
  searchBarText: {
    lineHeight: 1.5,
    padding: '0 4px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    transform: 'translateY(-1px)',
    fontWeight: 'normal',
  },
  input: {
    font: 'inherit',
    border: '0 !important',
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0,
    color: theme.palette.text.primary,
    width: '100%',
    padding: '0 !important',
    boxShadow: 'none !important',
    '&:focus': {
      outline: 0,
      border: 0,
      boxShadow: 'none',
    },
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
  },
  searchButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  iconButton: {
    padding: theme.spacing(0.5),
  },
});

const SearchBox = ({
  classes,
}) => (
  <Paper elevation={1} className={classes.toolbarSearchContainer}>
    <div className={classes.toolbarSectionSearch}>
      <Typography
        className={classes.searchBarText}
        color="inherit"
        variant="body1"
        component="div"
      >
        <AppSearchSearchBox
          searchAsYouType
          debounceLength={300}
          inputView={({ getAutocomplete, getInputProps }) => (
            <>
              <div className="sui-search-box__wrapper">
                <input
                  {...getInputProps({
                    className: classes.input,
                    placeholder: 'Search apps...',
                    onFocus: () => {
                      window.preventClosingWindow = true;
                    },
                    onBlur: () => {
                      window.preventClosingWindow = false;
                    },
                  })}
                />
                {getAutocomplete()}
              </div>
            </>
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
        {({ searchTerm, setSearchTerm, isLoading }) => (
          <>
            {searchTerm.length > 0 ? (
              <Tooltip title="Clear">
                <IconButton
                  color="default"
                  className={classes.iconButton}
                  aria-label="Clear"
                  onClick={() => setSearchTerm('', {
                    refresh: true,
                    debounce: 0,
                    shouldClearFilters: false,
                  })}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Refresh">
                <IconButton
                  color="default"
                  className={classes.iconButton}
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
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </WithSearch>
    </div>
  </Paper>
);

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  SearchBox,
  null,
  null,
  styles,
);
