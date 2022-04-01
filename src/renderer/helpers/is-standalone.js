/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import getStaticGlobal from './get-static-global';

import isSnap from './is-snap';

// Snap is a variant of standalone
// Mac App Store is treated as completely different distribution channel
const isStandalone = () => Boolean(getStaticGlobal('appJson').standalone || process.env.REACT_APP_FORCE_STANDALONE || isSnap());

export default isStandalone;
