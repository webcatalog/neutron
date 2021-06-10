/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const autoHibernateTimeouts = [
  { name: 'Immediately', value: 0 },
  { name: '30 seconds', value: 30000 },
  { name: '1 minutes', value: 60000 },
  { name: '5 minutes', value: 300000 },
  { name: '10 minutes', value: 600000 },
  { name: '15 minutes', value: 900000 },
  { name: '30 minutes', value: 1800000 },
  { name: '1 hour', value: 3600000 },
  { name: '2 hours', value: 2 * 3600000 },
  { name: '4 hours', value: 4 * 3600000 },
  { name: '6 hours', value: 6 * 3600000 },
  { name: '8 hours', value: 8 * 3600000 },
  { name: '10 hours', value: 10 * 3600000 },
  { name: '12 hours', value: 12 * 3600000 },
  { name: '24 hours', value: 24 * 3600000 },
];

export default autoHibernateTimeouts;
