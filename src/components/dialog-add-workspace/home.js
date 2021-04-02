/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, WithSearch, Paging } from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

import connectComponent from '../../helpers/connect-component';
import getStaticGlobal from '../../helpers/get-static-global';
import isWindowsStore from '../../helpers/is-windows-store';

import AppCard from './app-card';
import SubmitAppCard from './submit-app-card';
import NoConnection from './no-connection';
import EmptyState from './empty-state';
import SearchBox from './search-box';

const styles = (theme) => ({
  paper: {
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 0,
    overflow: 'auto',
  },
  grid: {
    marginBottom: theme.spacing(1),
  },
  homeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  badConfigContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  contentContainer: {
    padding: theme.spacing(1),
  },
  progressContainer: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    zIndex: 2,
  },
});

const connector = process.env.REACT_APP_SWIFTYPE_SEARCH_KEY ? new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
}) : null;

const Home = ({ classes }) => {
  if (!connector) {
    return (
      <div className={classes.badConfigContainer}>
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
        >
          Swiftype environment variables are required for &quot;Catalog&quot;. Learn more at: https://github.com/webcatalog/webcatalog-app/blob/master/README.md#development
        </Typography>
      </div>
    );
  }

  const filters = [
    { field: 'type', values: ['Singlesite'], type: 'all' },
    { field: 'widevine', values: [0], type: 'all' },
  ];
  const appJson = getStaticGlobal('appJson');
  const appJsonId = appJson.id;
  if (appJsonId.startsWith('group-')) {
    const groupId = appJsonId.substring('group-'.length);
    filters.push({ field: 'group_id', values: [groupId], type: 'all' });
  } else if (appJsonId === 'clovery') {
    filters.push({ field: 'group_id', values: ['google'], type: 'all' });
  } else if (appJsonId === 'tulipa') {
    filters.push({ field: 'group_id', values: ['microsoft'], type: 'all' });
  } else if (appJsonId === 'panmail') {
    filters.push({ field: 'sub_category', values: ['Email'], type: 'all' });
  }
  // hide Google Play in MS builds to comply with Microsoft's requirements
  // "The app enables in-app purchase of digital goods or services,
  // but does not use the Microsoft Store in-app purchase API.
  // Location where issue was found: Google Play Store""
  if (isWindowsStore()) {
    filters.push({ field: 'id', values: ['google-play'], type: 'none' });
  }

  return (
    <SearchProvider
      config={{
        apiConnector: connector,
        initialState: {
          resultsPerPage: 60,
          sortField: '',
          sortDirection: '',
        },
        alwaysSearchOnInitialLoad: true,
        searchQuery: {
          filters,
          result_fields: {
            id: { raw: {} },
            name: { raw: {} },
            url: { raw: {} },
            icon_filled: { raw: {} },
            icon_filled_128: { raw: {} },
          },
        },
      }}
    >
      <div className={classes.homeContainer}>
        {appJsonId !== 'panmail' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SearchBox />
            </Grid>
          </Grid>
        )}
        <div
          className={classes.scrollContainer}
        >
          <WithSearch
            mapContextToProps={({
              error,
              isLoading,
              results,
              searchTerm,
              setSearchTerm,
              wasSearched,
            }) => ({
              error,
              isLoading,
              results,
              searchTerm,
              setSearchTerm,
              wasSearched,
            })}
          >
            {({
              error,
              isLoading,
              results,
              searchTerm,
              setSearchTerm,
              wasSearched,
            }) => {
              if (error) {
                return (
                  <div className={classes.contentContainer}>
                    <NoConnection
                      onTryAgainButtonClick={() => {
                        setSearchTerm(searchTerm, {
                          refresh: true,
                          debounce: 0,
                          shouldClearFilters: false,
                        });
                      }}
                    />
                  </div>
                );
              }

              if (isLoading && results.length < 1) {
                return (
                  <div className={classes.contentContainer}>
                    <Typography
                      variant="body2"
                      align="center"
                      color="textSecondary"
                      className={classes.loading}
                    >
                      Loading...
                    </Typography>
                  </div>
                );
              }

              if (wasSearched && results.length < 1) {
                return (
                  <div className={classes.contentContainer}>
                    <EmptyState icon={SearchIcon} title="No Matching Results">
                      <Typography
                        variant="subtitle1"
                        align="center"
                      >
                        Your query did not match any apps in our database.
                      </Typography>
                      <Grid container justify="center" spacing={1} className={classes.noMatchingResultOpts}>
                        <SubmitAppCard />
                      </Grid>
                    </EmptyState>
                  </div>
                );
              }

              return (
                <>
                  {results.map((app) => (
                    <AppCard
                      key={app.id.raw}
                      id={app.id.raw}
                      name={app.name.raw}
                      url={app.url.raw}
                      icon={app.icon_filled.raw}
                      icon128={app.icon_filled_128.raw}
                    />
                  ))}
                  <Grid container justify="center">
                    <Paging />
                  </Grid>
                </>
              );
            }}
          </WithSearch>
        </div>
        <WithSearch
          mapContextToProps={({ isLoading }) => ({ isLoading })}
        >
          {({ isLoading }) => (
            <>
              {isLoading && (
                <div className={classes.progressContainer}>
                  <CircularProgress size={20} />
                </div>
              )}
            </>
          )}
        </WithSearch>
      </div>
    </SearchProvider>
  );
};

Home.defaultProps = {};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Home,
  null,
  null,
  styles,
);
