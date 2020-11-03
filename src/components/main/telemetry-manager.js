import { useEffect } from 'react';

import connectComponent from '../../helpers/connect-component';

import amplitude from '../../amplitude';

const TelemetryManager = () => {
  // run after setUserProperties
  // https://blog.logrocket.com/post-hooks-guide-react-call-order
  useEffect(() => {
    const appJson = window.remote.getGlobal('appJson');
    amplitude.getInstance().setUserProperties({ registered: Boolean(appJson.registered) });
    amplitude.getInstance().logEvent('webcatalog-engine: start app');

    // this is important to track usage correctly
    // if not, we will miss usage data when users keep the app open and switch back later
    // instead of quitting and restarting the app
    const win = window.remote.getCurrentWindow();
    const logFocus = () => {
      amplitude.getInstance().logEvent('focus app');
    };
    win.on('focus', logFocus);
    return () => {
      win.removeListener('focus', logFocus);
    };
  }, []);
  return null;
};

TelemetryManager.propTypes = {};

const mapStateToProps = () => ({});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
