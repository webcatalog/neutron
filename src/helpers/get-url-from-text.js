/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import isUrl from './is-url';

import searchEngines from '../constants/search-engines';

// if text is url, return text
// else, return search query url for that text
const getUrlFromText = (text, searchEngine) => {
  if (!text) return text;

  if (isUrl(text)) {
    return text;
  }

  const httpUrl = `http://${text}`;
  if (/[A-Za-z0-9]+(\.[A-Za-z0-9]+)+/.test(text) && isUrl(httpUrl)) { // match common url format
    return httpUrl;
  }

  const { queryUrl } = searchEngines[searchEngine];
  const processedUrl = queryUrl.replace('%s', encodeURIComponent(text));
  return processedUrl;
};

export default getUrlFromText;
