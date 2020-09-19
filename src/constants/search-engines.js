// https://en.wikipedia.org/wiki/List_of_search_engines
// based on Alexa ranking
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
