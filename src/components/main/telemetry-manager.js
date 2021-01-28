/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';

import appJson from '../../constants/app-json';

import amplitude from '../../amplitude';

const TelemetryManager = ({ registered }) => {
  // run after setUserProperties
  // https://blog.logrocket.com/post-hooks-guide-react-call-order
  useEffect(() => {
    amplitude.getInstance().setUserProperties({
      registered,
      isMas: isMas(),
    });
    amplitude.getInstance().logEvent('webcatalog-engine: start app');

    // this is important to track usage correctly
    // if not, we will miss usage data when users keep the app open and switch back later
    // instead of quitting and restarting the app
    const logFocus = () => {
      amplitude.getInstance().logEvent('webcatalog-engine: focus app');
    };
    window.ipcRenderer.on('log-focus', logFocus);
    return () => {
      window.ipcRenderer.removeListener('log-focus', logFocus);
    };
  }, [registered]);
  return null;
};

TelemetryManager.defaultProps = {
  registered: false,
};

TelemetryManager.propTypes = {
  registered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  registered: appJson.registered || state.preferences.iapPurchased,
});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
