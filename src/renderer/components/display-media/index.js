/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

import { getDesktopCapturerSourcesAsync } from '../../invokers';

const DisplayMedia = () => {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    getDesktopCapturerSourcesAsync({ types: ['window', 'screen'] })
      .then((res) => {
        setSources(res);
      });
  }, [setSources]);

  const screenSources = sources.filter((source) => source.id.startsWith('screen'));
  const windowSources = sources.filter((source) => source.id.startsWith('window'));
  // remove first item as it is the display media window itself
  windowSources.shift();

  return (
    <Box
      sx={{
        height: 1,
        width: 1,
        py: 2,
        px: 0,
        overflow: 'auto',
      }}
    >
      <Typography
        variant="body2"
        sx={{ px: 2 }}
      >
        The app wants to use the contents of your screen. Choose what you’d like to share.
      </Typography>
      <List>
        <ListSubheader disableSticky>Screens</ListSubheader>
        {screenSources.map((source) => (
          <ListItem
            key={source.id}
            button
            onClick={() => {
              ipcRenderer.send('display-media-selected', source.id);
            }}
          >
            <ListItemText primary={source.name} />
          </ListItem>
        ))}
        <Divider />
        <ListSubheader disableSticky>Windows</ListSubheader>
        {windowSources.map((source) => (
          <ListItem
            key={source.id}
            button
            onClick={() => {
              ipcRenderer.send('display-media-selected', source.id);
            }}
          >
            <ListItemText primary={source.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DisplayMedia;
