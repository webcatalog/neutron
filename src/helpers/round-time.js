/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// input: a millisecond value
// return value in hours/mins/seconds/milliseconds
const roundTime = (milliseconds) => {
  const secondInMilliseconds = 1000;
  const minuteInMilliseconds = 60 * secondInMilliseconds;
  const hourInMilliseconds = 60 * minuteInMilliseconds;
  if (milliseconds % hourInMilliseconds === 0) {
    return {
      value: Math.floor(milliseconds / hourInMilliseconds),
      unit: 'hours',
    };
  }
  if (milliseconds % minuteInMilliseconds === 0) {
    return {
      value: Math.floor(milliseconds / minuteInMilliseconds),
      unit: 'minutes',
    };
  }
  if (milliseconds % secondInMilliseconds === 0) {
    return {
      value: Math.floor(milliseconds / secondInMilliseconds),
      unit: 'seconds',
    };
  }
  return {
    value: milliseconds,
    unit: 'milliseconds',
  };
};

export default roundTime;
