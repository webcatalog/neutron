/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fs = require('fs');
const path = require('path');
const { webFrame } = require('electron');
const extractHostname = require('../../extract-hostname');

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
  'linear.app': 'linear',
  'web.telegram.org': 'telegram',
  'chat.zalo.me': 'zalo',
  'teams.microsoft.com': 'microsoft-teams',
  'fastmail.com': 'fastmail',
};

const get = (url) => {
  const hostname = extractHostname(url);
  const recipeId = mapper[hostname];
  if (recipeId) {
    const recipePath = process.env.NODE_ENV === 'production'
      ? path.join(__dirname, 'recipes', `${recipeId}.js`)
      : path.join(__dirname, `${recipeId}.js`);

    return {
      id: recipeId,
      code: fs.readFileSync(recipePath, 'utf8'),
    };
  }
  return null;
};

const load = () => {
  try {
    const recipe = get(window.location.href);
    if (recipe) {
      // eslint-disable-next-line no-console
      console.log('loaded recipe', recipe.id);
      webFrame.executeJavaScript(recipe.code);
    }
  } catch (err) {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
  }
};

module.exports = { load };
