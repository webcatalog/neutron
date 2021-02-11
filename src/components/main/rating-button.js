/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import FavoriteIcon from '@material-ui/icons/Favorite';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';
import isWindowsStore from '../../helpers/is-windows-store';
import getStaticGlobal from '../../helpers/get-static-global';
import {
  requestOpenInBrowser,
  requestSetPreference,
} from '../../senders';

const RatingButton = ({
  className,
  iconClassName,
  ratingDidRate,
  ratingLastClicked,
  size,
}) => {
  // for WebCatalog builds
  // hide this button
  if (!isMas() && !isWindowsStore()) {
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
          window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
            type: 'question',
            buttons: [
              `Rate ${appJson.name} on ${isMas() ? 'Mac App Store' : 'Microsoft Store'}`,
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
              } else if (isWindowsStore()) {
                requestOpenInBrowser(`ms-windows-store://review/?ProductId=${appJson.microsoftStoreId}`);
              }
            } else {
              requestSetPreference('ratingLastClicked', Date.now());
            }
          }).catch(console.log); // eslint-disable-line
        }}
      >
        <FavoriteIcon className={iconClassName} />
      </IconButton>
    );
  }

  return null;
};

RatingButton.defaultProps = {
  className: undefined,
  iconClassName: undefined,
  ratingDidRate: false,
  ratingLastClicked: 0,
  size: undefined,
};

RatingButton.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  ratingDidRate: PropTypes.bool,
  ratingLastClicked: PropTypes.number,
  size: PropTypes.string,
};

const mapStateToProps = (state) => ({
  ratingLastClicked: state.preferences.ratingLastClicked,
  ratingDidRate: state.preferences.ratingDidRate,
});

export default connectComponent(
  RatingButton,
  mapStateToProps,
);
