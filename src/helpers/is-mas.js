/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const isMasBool = Boolean(window.process.mas || process.env.REACT_APP_FORCE_MAS);

const isMas = () => isMasBool;

export default isMas;
