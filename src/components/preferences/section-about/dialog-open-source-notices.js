/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const DialogOpenSourceNotices = ({ open, onClose }) => {
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
      <DialogContent
        sx={{
          width: 1,
          height: 1,
          whiteSpace: 'pre-line',
          pb: 2,
          overflowX: 'hidden',
        }}
      >
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
