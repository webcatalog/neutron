/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyle = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    overflowY: 'scroll',
  },

}));

const TabBar = () => {
  const classes = useStyle();

  return (
    <div className={classes.wrapper}>
      {[...Array(5).keys()].map((i) => (<Button onClick={() => {
        window.ipcRenderer.send('request-new-tab-browser', 'https://gmail.com');
      }}>
        {`tab${i}`}
      </Button>))}
    </div>
  );
};

export default TabBar;
