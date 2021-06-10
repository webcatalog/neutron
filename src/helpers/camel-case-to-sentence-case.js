/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const camelCaseToSentenceCase = (val) => {
  // convert camel case to sentence case
  const valTitleRaw = val.replace(/([A-Z])/g, ' $1');
  const valTitle = valTitleRaw.charAt(0).toUpperCase() + valTitleRaw.slice(1);
  return valTitle;
};

export default camelCaseToSentenceCase;
