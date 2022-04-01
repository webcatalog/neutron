/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* should be the same as public/constants/search-engines.js */
const searchEngines = {
  google: {
    name: 'Google',
    queryUrl: 'http://www.google.com/search?q=%s',
  },
  baidu: {
    name: 'Baidu',
    queryUrl: 'https://www.baidu.com/s?wd=%s',
  },
  yahoo: {
    name: 'Yahoo!',
    queryUrl: 'https://search.yahoo.com/search?p=%s',
  },
  bing: {
    name: 'Bing',
    queryUrl: 'https://www.bing.com/search?q=%s',
  },
  yandex: {
    name: 'Yandex',
    queryUrl: 'https://yandex.com/search/?text=%s',
  },
  // skip sogo.com (no HTTPS)
  sogou: {
    name: 'Sogou',
    queryUrl: 'https://www.sogou.com/web?query=%s',
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    queryUrl: 'https://duckduckgo.com/?q=%s',
  },
  ask: {
    name: 'Ask.com',
    queryUrl: 'https://www.ask.com/web?q=%s',
  },
  // skip youdao.com (has abandoned general-purpose search engine)
  aol: {
    name: 'AOL',
    queryUrl: 'https://search.aol.com/search?p=%s',
  },
  ecosia: {
    name: 'Ecosia',
    queryUrl: 'https://www.ecosia.org/search?q=%s',
  },
  // https://support.startpage.com/index.php?/Knowledgebase/Article/View/1164/2/search-strings-or-adding-startpage-as-a-search-option-in-unsupported-browsers
  startpage: {
    name: 'StartPage',
    queryUrl: 'https://www.startpage.com/do/dsearch?query=%s',
  },
  qwant: {
    name: 'Qwant',
    queryUrl: 'https://www.qwant.com/?q=%s',
  },
};

export default searchEngines;
