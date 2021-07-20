/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// return if the app is installed from WebCatalog or from other sources
import isAppx from './is-appx';
import isMas from './is-mas';
import isStandalone from './is-standalone';

const isWebcatalog = () => !isAppx() && !isMas() && !isStandalone();

export default isWebcatalog;
