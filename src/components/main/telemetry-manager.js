/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';
import isWindowsStore from '../../helpers/is-windows-store';
import getStaticGlobal from '../../helpers/get-static-global';

import amplitude from '../../amplitude';

const TelemetryManager = ({ iapPurchased, telemetry }) => {
  const appJson = getStaticGlobal('appJson');
  const registered = appJson.registered || iapPurchased;

  useEffect(() => {
    amplitude.getInstance().setOptOut(!telemetry);
  }, [telemetry]);

  useEffect(() => {
    amplitude.getInstance().setUserProperties({
      registered,
      distributionChannel: (() => {
        if (isMas()) return 'macAppStore';
        if (isWindowsStore()) return 'windowsStore';
        return 'webcatalog';
      })(),
    });
  }, [registered]);

  // run after setUserProperties
  // https://blog.logrocket.com/post-hooks-guide-react-call-order
  useEffect(() => {
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
  }, []);

  return null;
};

TelemetryManager.defaultProps = {
  iapPurchased: false,
  telemetry: false,
};

TelemetryManager.propTypes = {
  iapPurchased: PropTypes.bool,
  telemetry: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  iapPurchased: state.preferences.iapPurchased,
  telemetry: state.preferences.telemetry,
});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
