/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    width: '100%',
    height: '100%',
    whiteSpace: 'pre-line',
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
  },
}));

const DialogOpenSourceNotices = ({ open, onClose }) => {
  const classes = useStyles();
  const [content, setContent] = useState(null);
  useEffect(() => {
    if (!open) {
      setContent(null);
      return;
    }

    const p = [
      window.fetch('./open-source-notices-automated.txt')
        .then((res) => res.text()),
      window.fetch('./open-source-notices-manual.txt')
        .then((res) => res.text()),
    ];

    Promise.all(p)
      .then((texts) => {
        setContent(texts.join('\n'));
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }, [open, setContent]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogContent className={classes.dialogContent}>
        {content || 'Loading...'}
      </DialogContent>
    </Dialog>
  );
};

DialogOpenSourceNotices.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DialogOpenSourceNotices;
