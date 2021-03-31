/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import amplitude from 'amplitude-js';
import { v5 as uuidv5 } from 'uuid';

amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
amplitude.getInstance().setVersionName(`engine@${window.remote.app.getVersion()}`);
// opt out by default
// we sync this with user pref in TelemetryManager
amplitude.getInstance().setOptOut(true);

// custom device id to unify uniques between webcatalog-app & neutron
if (window.machineId) {
  // share namespace between webcatalog-app & neutron
  const DEVICE_ID_NAMESPACE = '4b7e2725-dced-4244-b5f5-2221316d272c';
  const deviceId = uuidv5(window.machineId, DEVICE_ID_NAMESPACE);
  amplitude.getInstance().setDeviceId(deviceId);
}

export default amplitude;
