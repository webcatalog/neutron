/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  dialogContent: {
    width: '100%',
    height: '100%',
    whiteSpace: 'pre-line',
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
  },
});

const DialogOpenSourceNotices = ({
  classes,
}) => {
  const [content, setContent] = useState('Loading...');
  useEffect(() => {
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
  });

  return (
    <DialogContent className={classes.dialogContent}>
      {content}
    </DialogContent>
  );
};

DialogOpenSourceNotices.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  DialogOpenSourceNotices,
  null,
  null,
  styles,
);
