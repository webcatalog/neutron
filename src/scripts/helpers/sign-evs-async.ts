/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import execAsync from './exec-async';

const signEvsAsync = async (appOutDir: string) => {
  const signPkgCmd = `python3 -m castlabs_evs.vmp sign-pkg "${appOutDir}"`;
  // eslint-disable-next-line no-console
  console.log('Running:', signPkgCmd);
  const signingResult = await execAsync(signPkgCmd);
  // eslint-disable-next-line no-console
  console.log(signingResult);

  // verify
  const verifyingPkgCmd = `python3 -m castlabs_evs.vmp verify-pkg "${appOutDir}"`;
  // eslint-disable-next-line no-console
  console.log('Running:', verifyingPkgCmd);
  const verifyingResult = await execAsync(verifyingPkgCmd);
  // eslint-disable-next-line no-console
  console.log(verifyingResult);
};

export default signEvsAsync;
