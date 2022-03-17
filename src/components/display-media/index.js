/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { getDesktopCapturerSourcesAsync } from '../../invokers';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
    overflow: 'auto',
  },
  text: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const DisplayMedia = () => {
  const classes = useStyles();
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
    <div className={classes.root}>
      <Typography variant="body2" className={classes.text}>
        The app wants to use the contents of your screen. Choose what you’d like to share.
      </Typography>
      <List>
        <ListSubheader disableSticky>Screens</ListSubheader>
        {screenSources.map((source) => (
          <ListItem
            key={source.id}
            button
            onClick={() => {
              window.ipcRenderer.send('display-media-selected', source.id);
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
              window.ipcRenderer.send('display-media-selected', source.id);
            }}
          >
            <ListItemText primary={source.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default DisplayMedia;
