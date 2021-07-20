/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import connectComponent from '../../helpers/connect-component';
import isMas from '../../helpers/is-mas';
import isAppx from '../../helpers/is-appx';
import getStaticGlobal from '../../helpers/get-static-global';

import amplitude from '../../amplitude';
import isStandalone from '../../helpers/is-standalone';

const TelemetryManager = ({ iapPurchased, telemetry, standaloneRegistered }) => {
  const appJson = getStaticGlobal('appJson');
  const registered = appJson.registered || iapPurchased || standaloneRegistered;

  useEffect(() => {
    amplitude.getInstance().setOptOut(!telemetry);
  }, [telemetry]);

  useEffect(() => {
    amplitude.getInstance().setUserProperties({
      pricing: registered ? 'plus' : 'basic', // PRO plan to be added
      distributionChannel: (() => {
        if (isStandalone()) return 'standalone';
        if (isMas()) return 'macAppStore';
        if (isAppx()) return 'windowsStore'; // use 'windowsStore' for backward compatibility
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
  standaloneRegistered: false,
  telemetry: false,
};

TelemetryManager.propTypes = {
  iapPurchased: PropTypes.bool,
  standaloneRegistered: PropTypes.bool,
  telemetry: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  iapPurchased: isMas() && state.preferences.iapPurchased,
  standaloneRegistered: isStandalone() && state.preferences.standaloneRegistered,
  telemetry: state.preferences.telemetry,
});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
