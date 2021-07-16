/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fs = require('fs');
const path = require('path');
const extractHostname = require('./extract-hostname');

const mapper = {
  'discord.com': 'discord',
  'web.whatsapp.com': 'whatsapp',
  'mail.google.com': 'gmail',
  'app.slack.com': 'slack',
  'messenger.com': 'messenger',
  'mail.yahoo.com': 'yahoo-mail',
  'instagram.com': 'instagram',
  'feedly.com': 'feedly',
  'voice.google.com': 'google-voice',
  'tasks.google.com': 'google-tasks',
};

const getRecipe = (url) => {
  const hostname = extractHostname(url);
  const recipeId = mapper[hostname];
  if (recipeId) {
    return {
      id: recipeId,
      code: fs.readFileSync(path.join(__dirname, 'recipes', `${recipeId}.js`), 'utf8'),
    };
  }
  return null;
};

module.exports = getRecipe;
