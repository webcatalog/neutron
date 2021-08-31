/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const getAvatarText = (id, name, order) => {
  if (id === 'add') return '+';
  if (name) return name[0];
  if (typeof order === 'number') return order + 1;
  return '*';
};

export default getAvatarText;
