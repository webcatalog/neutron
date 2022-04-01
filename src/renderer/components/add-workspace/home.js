/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, WithSearch, Paging } from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import getStaticGlobal from '../../helpers/get-static-global';
import isMas from '../../helpers/is-mas';
import isAppx from '../../helpers/is-appx';
import isStandalone from '../../helpers/is-standalone';

import AppCard from './app-card';
import SubmitAppCard from './submit-app-card';
import NoConnection from './no-connection';
import EmptyState from './empty-state';
import SearchBox from './search-box';

const connector = process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY
  ? new AppSearchAPIConnector({
    searchKey: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY,
    engineName: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME,
    endpointBase: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT,
  }) : null;

const filters = [
  { field: 'type', values: ['Singlesite'], type: 'all' },
];
if (
  // widevine is not supported is mas-build & appx
  isMas()
  || isAppx()
  // widevine is not supported on ARM64 Linux && Windows
  || (window.process.platform === 'linux' && window.process.arch === 'arm64')
  || (window.process.platform === 'win32' && window.process.arch === 'arm64')
  // widevine is not supported on WebCatalog + Windows (but supported in standalone builds)
  || (window.process.platform === 'win32' && !isStandalone())
) {
  filters.push({ field: 'widevine', values: [0], type: 'all' });
}
const appJson = getStaticGlobal('appJson');
const appJsonId = appJson.id;
if (appJsonId.startsWith('group-')) {
  const groupId = appJsonId.substring('group-'.length);
  filters.push({ field: 'group_id', values: [groupId], type: 'all' });
} else if (appJsonId === 'clovery') {
  filters.push({ field: 'group_id', values: ['google'], type: 'all' });
}

const Home = () => {
  const scrollContainerRef = useRef(null);

  if (!connector) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          justifyContent: 'center',
          p: 1,
        }}
      >
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
        >
          AppSearch environment variables are required for &quot;Catalog&quot;. Learn more at: https://github.com/webcatalog/webcatalog-app/blob/master/README.md#development
        </Typography>
      </Box>
    );
  }

  return (
    <SearchProvider
      config={{
        apiConnector: connector,
        onSearch: (state, queryConfig, next) => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }

          return next(state, queryConfig);
        },
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
            require_instance_url: { raw: {} },
          },
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchBox />
          </Grid>
        </Grid>
        <Box
          sx={{
            flex: 1,
            p: 0,
            overflow: 'auto',
          }}
          ref={scrollContainerRef}
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
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <NoConnection
                      onTryAgainButtonClick={() => {
                        setSearchTerm(searchTerm, {
                          refresh: true,
                          debounce: 0,
                          shouldClearFilters: false,
                        });
                      }}
                    />
                  </Box>
                );
              }

              if (isLoading && results.length < 1) {
                return (
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      align="center"
                      color="textSecondary"
                    >
                      Loading...
                    </Typography>
                  </Box>
                );
              }

              if (wasSearched && results.length < 1) {
                return (
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <EmptyState icon={SearchIcon} title="No Matching Results">
                      <Typography
                        variant="subtitle1"
                        align="center"
                      >
                        Your query did not match any apps in our database.
                      </Typography>
                      <Grid
                        container
                        justifyContent="center"
                        spacing={1}
                      >
                        <SubmitAppCard />
                      </Grid>
                    </EmptyState>
                  </Box>
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
                      requireInstanceUrl={app.require_instance_url
                      && app.require_instance_url.raw === 1}
                    />
                  ))}
                  <SubmitAppCard />
                  <Grid container justifyContent="center">
                    <Paging />
                  </Grid>
                </>
              );
            }}
          </WithSearch>
        </Box>
        <WithSearch
          mapContextToProps={({ isLoading, error }) => ({ isLoading, error })}
        >
          {({ isLoading, error }) => isLoading && !error && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 5,
                left: 5,
                zIndex: 2,
              }}
            >
              <CircularProgress size={20} />
            </Box>
          )}
        </WithSearch>
      </Box>
    </SearchProvider>
  );
};

export default Home;