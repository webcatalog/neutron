/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  OPEN_DIALOG_EXTENSIONS,
  CLOSE_DIALOG_EXTENSIONS,
} from '../../constants/actions';

export const open = () => ({
  type: OPEN_DIALOG_EXTENSIONS,
});

export const close = () => ({
  type: CLOSE_DIALOG_EXTENSIONS,
});
