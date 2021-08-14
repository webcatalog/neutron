/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const cheerio = require('cheerio');
const url = require('url');
const fetch = require('node-fetch').default;

const getWebsiteIconUrlAsync = (websiteURL) => fetch(websiteURL)
  .then((res) => res.text().then((html) => ({ html, redirectedUrl: res.url })))
  .then(({ html, redirectedUrl }) => {
    const $ = cheerio.load(html);
    // rel=fluid-icon
    // https://webmasters.stackexchange.com/questions/23696/whats-the-fluid-icon-meta-tag-for
    const $fluidIcon = $('head > link[rel=fluid-icon]');
    if ($fluidIcon.length > 0) {
      return url.resolve(redirectedUrl, $fluidIcon.attr('href'));
    }

    const getMaxSizeIcon = (rootElm) => {
      let icon;
      let maxSize = 0;
      // find the icon with largest size
      rootElm.each((i, _elm) => {
        const elm = $(_elm);
        // make sure icon is png
        // check if type is PNG
        // also check to make sure links doesn't end with .ico
        // as some websites specify icon type wrong
        // see https://github.com/webcatalog/webcatalog-app/issues/630 for more details
        if ((elm.attr('type') === 'image/png' && !elm.attr('href').endsWith('.ico'))
          || elm.attr('href').endsWith('.png')) { // if type is not specified but link ends with .png then assumes that the icon is PNG
          const size = elm.attr('sizes') ? parseInt(elm.attr('sizes').split('x'), 10) : 0;
          if (size >= maxSize) {
            maxSize = size;
            icon = url.resolve(redirectedUrl, elm.attr('href'));
          }
        }
      });
      return icon;
    };

    // rel=apple-touch-icon
    // more preferred because it's not transparent
    const $appleTouchIcon = $('head > link[rel=apple-touch-icon]');
    if ($appleTouchIcon.length > 0) {
      const icon = getMaxSizeIcon($appleTouchIcon);
      if (icon) return icon;
    }
    // rel=apple-touch-icon-precomposed
    // more preferred because it's not transparent
    const $appleTouchIconPrecomposed = $('head > link[rel=apple-touch-icon-precomposed]');
    if ($appleTouchIconPrecomposed.length > 0) {
      const icon = getMaxSizeIcon($appleTouchIconPrecomposed);
      if (icon) return icon;
    }

    // for code sharing
    // I know this is lazy, but it works so whatever
    const lessPriorityCheck = () => {
      // rel=icon
      // less preferred because it's not always in high resolution
      const $icon = $('head > link[rel=icon]');
      if ($icon.length > 0) {
        const icon = getMaxSizeIcon($icon);
        if (icon) return icon;
      }
      // rel=icon
      // less preferred because it's not always in high resolution
      const $shortcutIcon = $('head > link[rel=\'shortcut icon\']');
      if ($shortcutIcon.length > 0) {
        const icon = getMaxSizeIcon($shortcutIcon);
        if (icon) return icon;
      }
      return undefined;
    };

    // manifest.json icon
    // https://developers.google.com/web/fundamentals/web-app-manifest
    const $manifest = $('head > link[rel=manifest]');
    if ($('head > link[rel=manifest]').length > 0) {
      const manifestUrl = url.resolve(redirectedUrl, $manifest.attr('href'));
      return fetch(manifestUrl)
        .then((res) => res.text().then((manifestJson) => ({
          manifestJson,
          manifestRedirectedUrl: res.url,
        })))
        .then(({ manifestJson, manifestRedirectedUrl }) => {
          // return icon with largest size
          const { icons } = manifestJson;
          icons.sort((x, y) => parseInt(x.sizes.split('x'), 10) - parseInt(y.sizes.split('x'), 10));
          return url.resolve(manifestRedirectedUrl, icons[icons.length - 1].src);
        })
        // youtube.com/manifest.json doesn't specify icons
        // error needs to be catched and the other checks need to be run
        .catch(() => lessPriorityCheck());
    }

    return lessPriorityCheck();
  })
  .then((icon) => {
    if (icon) return icon;

    // try to get /apple-touch-icon.png
    // https://apple.stackexchange.com/questions/172204/how-apple-com-set-apple-touch-icon
    const appleTouchIconUrl = url.resolve(websiteURL, '/apple-touch-icon.png');
    return fetch(appleTouchIconUrl)
      .then((res) => {
        if (res.status === 200 && res.headers.get('Content-Type') === 'image/png') return appleTouchIconUrl;
        return undefined;
      })
      .catch(() => undefined);
  });

module.exports = getWebsiteIconUrlAsync;
