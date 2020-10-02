import { useEffect } from 'react';

import connectComponent from '../../helpers/connect-component';

import amplitude from '../../amplitude';

const TelemetryManager = () => {
  // run after setUserProperties
  // https://blog.logrocket.com/post-hooks-guide-react-call-order
  useEffect(() => {
    if (window.mode === 'main' || window.mode === 'menubar') {
      const appJson = window.remote.getGlobal('appJson');
      amplitude.getInstance().setUserProperties({ registered: Boolean(appJson.registered) });
      amplitude.getInstance().logEvent('webcatalog-engine: start app');
    }
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
