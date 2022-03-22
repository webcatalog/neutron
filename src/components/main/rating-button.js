/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { dialog, getCurrentWindow } from '@electron/remote';

import IconButton from '@mui/material/IconButton';

import ThumbsUpIcon from '@mui/icons-material/ThumbUp';

import { useSelector } from 'react-redux';

import isAppx from '../../helpers/is-appx';
import isMas from '../../helpers/is-mas';
import getStaticGlobal from '../../helpers/get-static-global';
import {
  requestOpenInBrowser,
  requestSetPreference,
} from '../../senders';

const RatingButton = ({
  className,
  iconClassName,
  size,
}) => {
  const ratingLastClicked = useSelector((state) => state.preferences.ratingLastClicked);
  const ratingDidRate = useSelector((state) => state.preferences.ratingDidRate);

  // avoid asking for review immediately when user first starts using the app
  useEffect(() => {
    if (ratingLastClicked < 1) {
      requestSetPreference('ratingLastClicked', Date.now());
    }
  }, [ratingLastClicked]);

  // for WebCatalog builds
  // hide this button
  if (!isMas() && !isAppx()) {
    return null;
  }

  // time gap between rating card request
  // for Mac App Store builds
  // 3 months if user has rated the app, 1 week if user chooses "Later"
  const gap = ratingDidRate ? 3 * 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  const now = Date.now();

  if (now > ratingLastClicked + gap) {
    const appJson = getStaticGlobal('appJson');
    return (
      <IconButton
        title="Rate the App"
        aria-label="Rate the App"
        className={className}
        size={size}
        onClick={() => {
          dialog.showMessageBox(getCurrentWindow(), {
            type: 'question',
            buttons: [
              isAppx() ? `Rate ${appJson.name} on Microsoft Store` : `Rate ${appJson.name} on Mac App Store`,
              'Later',
            ],
            message: `Enjoying ${appJson.name}?`,
            detail: `If you enjoy using ${appJson.name}, would you mind taking a moment to review it?`,
            cancelId: 1,
            defaultId: 0,
          }).then(({ response }) => {
            if (response === 0) {
              requestSetPreference('ratingLastClicked', Date.now());
              requestSetPreference('ratingDidRate', true);
              if (isMas()) {
                requestOpenInBrowser(`macappstore://apps.apple.com/app/id${appJson.macAppStoreId}?action=write-review`);
              } else if (isAppx()) {
                requestOpenInBrowser(`ms-windows-store://review/?ProductId=${appJson.microsoftStoreId}`);
              }
            } else {
              requestSetPreference('ratingLastClicked', Date.now());
            }
          }).catch(console.log); // eslint-disable-line
        }}
      >
        <ThumbsUpIcon className={iconClassName} />
      </IconButton>
    );
  }

  return null;
};

RatingButton.defaultProps = {
  className: undefined,
  iconClassName: undefined,
  size: undefined,
};

RatingButton.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  size: PropTypes.string,
};

export default RatingButton;
