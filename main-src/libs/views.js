/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-param-reassign */
const {
  BrowserView,
  BrowserWindow,
  MenuItem,
  app,
  ipcMain,
  session,
  shell,
} = require('electron');
const path = require('path');
const fsExtra = require('fs-extra');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const unusedFilename = require('unused-filename');
const pupa = require('pupa');
const extName = require('ext-name');
const { ElectronChromeExtensions } = require('electron-chrome-extensions');
const electronRemote = require('@electron/remote/main');

const fetch = require('./customized-fetch');

const appJson = require('../constants/app-json');

const { getPreference, getPreferences } = require('./preferences');
const {
  getWorkspace,
  getWorkspaces,
  getWorkspacePreference,
  getWorkspacePreferences,
  setWorkspace,
  removeWorkspaceAccountInfo,
} = require('./workspaces');
const {
  setWorkspaceMeta,
  getWorkspaceMeta,
  getWorkspaceMetas,
} = require('./workspace-metas');
const {
  setWorkspaceBadgeCount,
} = require('./workspace-badges');
const ContextMenuBuilder = require('./context-menu-builder');

const sendToAllWindows = require('./send-to-all-windows');
const getViewBounds = require('./get-view-bounds');
const isMas = require('./is-mas');
const getUtmSource = require('./get-utm-source');
const getWorkspaceFriendlyName = require('./get-workspace-friendly-name');
const getExtensionFromProfile = require('./extensions/get-extensions-from-profile');
const isSnap = require('./is-snap');
const isAppx = require('./is-appx');
const isWebcatalog = require('./is-webcatalog');
const getFirefoxUserAgent = require('./get-firefox-user-agent');
const getSafariUserAgent = require('./get-safari-user-agent');
const getChromeWithoutVersionUserAgent = require('./get-chrome-without-version-user-agent');

const views = {};
let shouldMuteAudio;
let shouldPauseNotifications;

/* electron-dl port start */
// MIT License: https://github.com/sindresorhus/electron-dl/blob/master/license
// https://github.com/sindresorhus/electron-dl
const downloadItems = new Set();
let receivedBytes = 0;
let completedBytes = 0;
let totalBytes = 0;
const activeDownloadItems = () => downloadItems.size;
const progressDownloadItems = () => receivedBytes / totalBytes;
const extensionManagers = {};

const getFilenameFromMime = (name, mime) => {
  const extensions = extName.mime(mime);

  if (extensions.length !== 1) {
    return name;
  }

  return `${name}.${extensions[0].ext}`;
};
/* electron-dl port end */

const extractDomain = (fullUrl) => {
  if (!fullUrl) return null;
  const matches = fullUrl.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  // https://stackoverflow.com/a/9928725
  return domain ? domain.replace(/^(www\.)/, '') : null;
};

// https://stackoverflow.com/a/14645182
const isSubdomain = (url) => {
  // eslint-disable-next-line prefer-regex-literals
  const regex = new RegExp(/^([a-z]+:\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
  return !!url.match(regex); // make sure it returns boolean
};

const badgeRules = [
  // "(2) Inbox | Gmail"
  /(?<=[([{])(\d*?)(?=[}\])])/,
  // "1 · Inbox — Yandex.Mail"
  // eslint-disable-next-line no-irregular-whitespace
  // "1 • Inbox | Fastmail"
  // eslint-disable-next-line no-irregular-whitespace
  /(?<=^)(\d*?)(?=[  ][•·-])/,
];
const getBadgeCountFromTitle = (title) => {
  // https://stackoverflow.com/a/2842390/5522263
  // strip US phone numbers from title
  // as badge rule might mistaken them as badge count
  let strippedTitle = title;
  const phoneNumberMatches = /(\(?\d+\)?)([ .-])(\d+)([ .-])(\d+)/.exec(title);
  if (phoneNumberMatches) {
    strippedTitle = strippedTitle.replace(phoneNumberMatches[0], '');
  }

  for (let i = 0; i < badgeRules.length; i += 1) {
    const matches = badgeRules[i].exec(strippedTitle);
    const incStr = matches ? matches[1] : '';
    const inc = parseInt(incStr, 10);
    if (inc && typeof inc === 'number' && !Number.isNaN(inc)) return inc;
  }
  return 0;
};

const getEquivalentDomain = (domain) => {
  if (!domain) return null;

  let eDomain = domain;

  const prefixes = [
    'www', 'app', 'login', 'go', 'accounts', 'open', 'web', 'join',
    'auth', 'hello',
  ];
  // app.portcast.io ~ portcast.io
  // login.xero.com ~ xero.com
  // go.xero.com ~ xero.com
  // accounts.google.com ~ google.com
  // open.spotify.com ~ spotify.com
  // web.whatsapp.com ~ whatsapp.com
  // join.slack.com ~ slack.com
  // auth.monday.com ~ monday.com
  // hello.dubsado.com ~ dubsado.com

  // remove one by one not to break domain
  prefixes.forEach((prefix) => {
    // check if subdomain, if not return the domain
    if (isSubdomain(eDomain)) {
      // https://stackoverflow.com/a/9928725
      const regex = new RegExp(`^(${prefix}.)`);
      eDomain = eDomain.replace(regex, '');
    }
  });

  return eDomain;
};

// return the compatible User-Agent string for the given URL
// return null if default UA string (app.userAgentFallback) should be used
const getCompatibleUserAgentString = (url) => {
  let urlObj;
  try {
    urlObj = new URL(url);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  // fix Google prevents signing in because of security concerns
  // https://github.com/webcatalog/webcatalog-app/issues/455
  // https://github.com/meetfranz/franz/issues/1720#issuecomment-566460763
  if (urlObj && ['accounts.google.com'].includes(urlObj.hostname)) {
    // https://github.com/getferdi/ferdi/blob/5138746ae7d8e7307b5287a240bef9df3bb8fe6c/src/models/UserAgent.js#L62
    // force Google to use legacy login page
    return getChromeWithoutVersionUserAgent();
    // Firefox UA sometimes works (+ modern login page) but sometimes doesn't so we avoid using it
  }

  // Google Earth will attempt to use `SharedArrayBuffer` API if it detects Chrome UA
  // `SharedArrayBuffer` is disabled to prevent Spectre-related security issues
  if (urlObj && ['earth.google.com'].includes(urlObj.hostname)) {
    return getFirefoxUserAgent();
  }

  // Google uses special code for Chromium-based browsers
  // when screensharing (not working with Electron)
  // so change user-agent to Safari to make it work
  if (urlObj && ['meet.google.com', 'hangouts.google.com'].includes(urlObj.hostname)) {
    return getSafariUserAgent();
  }

  return null;
};

const isMicrosoftUrl = (url) => /.+(microsoft.com|live.com|1drv.ms|office.com|sharepoint.com|skype.com)/g.test(url);

const isInternalUrl = (url, currentInternalUrls) => {
  // // Google Printing PDF CDN
  if (url && url.includes('apps-viewer.googleusercontent.com')) {
    return true;
  }

  // google have a lot of redirections after logging in
  // so assume any requests made after 'accounts.google.com' are internals
  for (let i = 0; i < currentInternalUrls.length; i += 1) {
    if (currentInternalUrls[i] && currentInternalUrls[i].startsWith('https://accounts.google.com')) {
      return true;
    }
  }

  // external links sent in Google Meet meeting goes through this link first
  // https://meet.google.com/linkredirect?authuser=1&dest=https://something.com
  if (url.startsWith('https://meet.google.com/linkredirect')) {
    return false;
  }

  // Microsoft uses many different domains
  // So we define special rules for it
  if (isMicrosoftUrl(url)) {
    for (let i = 0; i < currentInternalUrls.length; i += 1) {
      if (currentInternalUrls[i] && isMicrosoftUrl(currentInternalUrls[i])) {
        return true;
      }
    }
  }

  const domain = getEquivalentDomain(extractDomain(url));
  const matchedInternalUrl = currentInternalUrls.find((internalUrl) => {
    const internalDomain = getEquivalentDomain(extractDomain(internalUrl));

    // Ex: music.yandex.ru => passport.yandex.ru?retpath=....music.yandex.ru
    // https://github.com/webcatalog/webcatalog-app/issues/546#issuecomment-586639519
    if (domain === 'clck.yandex.ru' || domain === 'passport.yandex.ru') {
      return url.includes(internalDomain);
    }

    // domains match
    return domain === internalDomain;
  });

  return Boolean(matchedInternalUrl);
};

const updateAddress = (url) => {
  sendToAllWindows('update-address', url, false);
  ipcMain.emit('create-menu');
};

const addViewAsync = async (browserWindow, workspace) => {
  const viewId = workspace.id;

  if (views[viewId] != null) return;

  // configure session & ad blocker
  const partitionId = global.shareWorkspaceBrowsingData ? 'persist:shared' : `persist:${workspace.id}`;
  const ses = session.fromPartition(partitionId);

  // user agent
  const customUserAgent = getWorkspacePreference(workspace.id, 'customUserAgent') || getPreference('customUserAgent');
  if (customUserAgent) {
    ses.setUserAgent(customUserAgent);
  }

  // proxy
  let {
    proxyMode,
    proxyRules,
    proxyBypassRules,
    proxyPacScript,
  } = global.proxyMode;

  // if the workspaces share the same session
  // users won't be able to set proxy per workspace
  if (!global.shareWorkspaceBrowsingData
      && getWorkspacePreference(workspace.id, 'proxyMode') !== null) {
    proxyMode = getWorkspacePreference(workspace.id, 'proxyMode');

    const proxyProtocol = getWorkspacePreference(workspace.id, 'proxyProtocol');
    const proxyAddress = getWorkspacePreference(workspace.id, 'proxyAddress');
    const proxyPort = getWorkspacePreference(workspace.id, 'proxyPort');
    proxyRules = `${proxyProtocol}://${proxyAddress}:${proxyPort || '80'}`;

    proxyBypassRules = getWorkspacePreference(workspace.id, 'proxyBypassRules');
    proxyPacScript = getWorkspacePreference(workspace.id, 'proxyPacScript');
  }

  if (proxyMode === 'fixed_servers') {
    ses.setProxy({
      mode: 'fixed_servers',
      proxyRules,
      proxyBypassRules,
    });
  } else if (proxyMode === 'pac_script') {
    ses.setProxy({
      mode: 'pac_script',
      proxyPacScript,
      proxyBypassRules,
    });
  } else if (proxyMode === 'system') {
    ses.setProxy({
      mode: 'system',
    });
  }

  // blocker
  const shouldBlockAds = getWorkspacePreference(workspace.id, 'blockAds') || global.blockAds;
  if (shouldBlockAds) {
    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch, {
      path: path.join(app.getPath('userData'), 'adblocker.bin'),
      read: fsExtra.readFile,
      write: fsExtra.writeFile,
    }).then((blocker) => {
      blocker.enableBlockingInSession(ses);
    });
  }
  // spellchecker
  if (global.spellcheck && process.platform !== 'darwin') {
    ses.setSpellCheckerLanguages(global.spellcheckLanguages);
  }

  // UA adjustment
  // modifed from https://github.com/minbrowser/min/blob/58927524e3cc16cc4f59bca09a6c352cec1a16ac/main/UASwitcher.js (Apache License)
  if (!customUserAgent) {
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
      let compatibleUaString;
      if (details.url) {
        compatibleUaString = getCompatibleUserAgentString(details.url);
      }
      if (!compatibleUaString && details.referrer) {
        compatibleUaString = getCompatibleUserAgentString(details.referrer);
      }

      if (compatibleUaString) {
        details.requestHeaders['User-Agent'] = compatibleUaString;
      } else {
        const chromiumVersion = process.versions.chrome.split('.')[0];
        details.requestHeaders['SEC-CH-UA'] = `"Chromium";v="${chromiumVersion}", " Not A;Brand";v="99"`;
        details.requestHeaders['SEC-CH-UA-MOBILE'] = '?0';
      }

      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
  }

  const {
    blockJavascript,
    defaultFontSize,
    defaultFontSizeMinimum,
    defaultFontSizeMonospace,
  } = getPreferences();

  // set preload script at session level
  // to ensure that even popup windows have access to the script
  if (ses.getPreloads().length < 1) {
    const preloadPath = process.env.NODE_ENV === 'production'
      ? path.join(__dirname, 'view-preload.js')
      : path.join(__dirname, 'view-preload', 'index.js');
    ses.setPreloads([preloadPath]);
  }

  const sharedWebPreferences = {
    spellcheck: global.spellcheck,
    nativeWindowOpen: true,
    nodeIntegration: false,
    contextIsolation: true,
    plugins: true, // PDF reader
    scrollBounce: true,
    session: ses,
    defaultFontSize,
    defaultMonospaceFontSize: defaultFontSizeMonospace,
    minimumFontSize: defaultFontSizeMinimum,
    javascript: !blockJavascript,
  };

  // extensions
  if (global.extensionEnabled) {
    const loadableExtensions = getExtensionFromProfile(
      global.extensionSourceBrowserId,
      global.extensionSourceProfileDirName,
    )
      .filter((ext) => global.extensionEnabledExtesionIds[ext.id]);
    if (loadableExtensions.length > 0 && !extensionManagers[partitionId]) {
      extensionManagers[partitionId] = new ElectronChromeExtensions({
        modulePath: process.env.NODE_ENV === 'production' ? path.join(__dirname, 'electron-chrome-extensions') : undefined,
        session: ses,
        createTab(details) {
          const win = new BrowserWindow({
            show: true,
            width: 800,
            height: 600,
            webPreferences: sharedWebPreferences,
          });

          if (details && details.url) {
            win.loadURL(details.url);
          }

          return [win.webContents, win];
        },
        createWindow(details) {
          const win = new BrowserWindow({
            show: true,
            width: details.width || 800,
            height: details.height || 600,
            webPreferences: sharedWebPreferences,
          });

          if (details && details.url) {
            win.loadURL(details.url);
          }

          return win;
        },
      });
    }
    await Promise.all(
      // eslint-disable-next-line no-console
      loadableExtensions.map((ext) => ses.loadExtension(ext.path).catch(console.log)),
    );
  }
  const extensions = extensionManagers[partitionId];

  const view = new BrowserView({
    webPreferences: sharedWebPreferences,
  });
  electronRemote.enable(view.webContents);

  if (extensions) {
    extensions.addTab(view.webContents, browserWindow);
  }

  view.webContents.workspaceId = workspace.id;
  // background needs to explictly set
  // if not, by default, the background of BrowserView is transparent
  // which would break the CSS of certain websites
  // even with dark mode, all major browsers
  // always use #FFF as default page background
  // https://github.com/webcatalog/webcatalog-app/issues/723
  // https://github.com/electron/electron/issues/16212
  view.setBackgroundColor('#FFFFFFFF'); // not actually working, currently handling this in the renderer

  view.webContents.on('will-navigate', (e, nextUrl) => {
    // open external links in browser
    // https://github.com/webcatalog/webcatalog-app/issues/849#issuecomment-629587264
    // this behavior is likely to break many apps (eg Microsoft Teams)
    // apply this rule only to github.com for now
    const appUrl = getWorkspace(workspace.id).homeUrl || appJson.url;
    const currentUrl = e.sender.getURL();
    const appDomain = extractDomain(appUrl);
    const currentDomain = extractDomain(currentUrl);

    // check external rule set by user
    // https://docs.webcatalog.io/article/43-how-to-define-external-urls
    const externalUrlRule = getWorkspacePreference(workspace.id, 'externalUrlRule') || getPreference('externalUrlRule');
    if (nextUrl && externalUrlRule) {
      const re = new RegExp(`^${externalUrlRule}$`, 'i');
      if (re.test(nextUrl)) {
        e.preventDefault();
        shell.openExternal(nextUrl);
        return;
      }
    }

    // check our rules
    if (
      ((appDomain && appDomain.includes('github.com')) || (currentDomain && currentDomain.includes('github.com')))
      && !isInternalUrl(nextUrl, [appUrl, currentUrl])
    ) {
      e.preventDefault();
      shell.openExternal(nextUrl);
      return;
    }

    // strip account info when logging out
    if (nextUrl.startsWith('https://accounts.google.com/Logout')) {
      removeWorkspaceAccountInfo(workspace.id);
    }

    // prevent users from accessing pricing pages
    // to comply with MAS Guideline 3.1.1 - Business - Payments - In-App Purchase
    if (isMas()) {
      if (nextUrl.includes('fastmail.com/pricing')) {
        e.preventDefault();
      }
    }
  });

  view.webContents.on('did-start-loading', () => {
    const workspaceObj = getWorkspace(workspace.id);
    // this event might be triggered
    // even after the workspace obj and BrowserView
    // are destroyed. See https://github.com/webcatalog/webcatalog-app/issues/836
    if (!workspaceObj) return;

    if (workspaceObj.active) {
      if (getWorkspaceMeta(workspace.id).didFailLoad) {
        // show browserView again when reloading after error
        // see did-fail-load event
        if (browserWindow && !browserWindow.isDestroyed()) { // fix https://github.com/atomery/singlebox/issues/228
          const contentSize = browserWindow.getContentSize();
          view.setBounds(getViewBounds(contentSize));
        }
      }
    }

    setWorkspaceMeta(workspace.id, {
      didFailLoad: null,
      isLoading: true,
    });
  });

  view.webContents.on('did-stop-loading', () => {
    const workspaceObj = getWorkspace(workspace.id);
    // this event might be triggered
    // even after the workspace obj and BrowserView
    // are destroyed. See https://github.com/webcatalog/webcatalog-app/issues/836
    if (!workspaceObj) return;

    if (workspaceObj.active) {
      updateAddress(view.webContents.getURL());
    }

    const currentUrl = view.webContents.getURL();
    setWorkspace(workspace.id, {
      lastUrl: currentUrl,
    });
    setWorkspaceMeta(workspace.id, {
      isLoading: false,
    });
    ipcMain.emit('request-realign-active-workspace');
  });

  // focus on initial load
  // https://github.com/webcatalog/webcatalog-app/issues/398
  if (workspace.active) {
    view.webContents.once('did-stop-loading', () => {
      if (browserWindow && !browserWindow.isDestroyed()
        && browserWindow.isFocused() && !view.webContents.isFocused()) {
        view.webContents.focus();
      }
    });
  }

  // https://electronjs.org/docs/api/web-contents#event-did-fail-load
  view.webContents.on('did-fail-load', (e, errorCode, errorDesc, validateUrl, isMainFrame) => {
    const workspaceObj = getWorkspace(workspace.id);
    // this event might be triggered
    // even after the workspace obj and BrowserView
    // are destroyed. See https://github.com/webcatalog/webcatalog-app/issues/836
    if (!workspaceObj) return;

    if (isMainFrame && errorCode < 0 && errorCode !== -3) {
      setWorkspaceMeta(workspace.id, {
        didFailLoad: errorDesc,
        isLoading: false,
      });
      if (workspaceObj.active) {
        sendToAllWindows('update-loading', false);
        if (browserWindow && !browserWindow.isDestroyed()) { // fix https://github.com/atomery/singlebox/issues/228
          const contentSize = browserWindow.getContentSize();
          view.setBounds(
            getViewBounds(contentSize, false, 0, 0),
          ); // hide browserView to show error message
        }
        sendToAllWindows('update-did-fail-load', true);
      }
    }

    // edge case to handle failed auth
    if (errorCode === -300 && view.webContents.getURL().length === 0) {
      view.webContents.loadURL(workspaceObj.homeUrl || appJson.url);
    }
  });

  const handleDidNavigateCompability = (contents, url) => {
    // Google uses special code for Chromium-based browsers
    // when screensharing (not working with Electron)
    // so change user-agent to Safari to make it work
    if (!customUserAgent && url) {
      const compatibleUaString = getCompatibleUserAgentString(url);
      // if getCompatibleUserAgentString() returns null, it means we suppose to restore
      // UA back to `app.userAgentFallback`
      // but we avoid doing that as it might cause problems in some cases
      // for example,
      // UA change causes page to reload, causing certain info (e.g. sessions) to be lost
      const currentUaStr = contents.userAgent;
      // we shouldn't change UA for accounts.google.com (Chrome UA without version) here
      // as we already handle it at request level
      // also, changing UA back after logging in will
      // cause Google Oauth to stop working for certain websites
      if (compatibleUaString != null && !url.startsWith('https://accounts.google.com')) {
        if (currentUaStr !== compatibleUaString) {
          contents.userAgent = compatibleUaString;
          // eslint-disable-next-line no-console
          console.log('Changed user agent to', compatibleUaString, 'for web compatibility URL: ', url, 'when', 'did-navigate');
        }
      }
    }
  };

  view.webContents.on('did-navigate', (e, url) => {
    const workspaceObj = getWorkspace(workspace.id);
    // this event might be triggered
    // even after the workspace obj and BrowserView
    // are destroyed. See https://github.com/webcatalog/webcatalog-app/issues/836
    if (!workspaceObj) return;

    if (workspaceObj.active) {
      sendToAllWindows('update-can-go-back', view.webContents.canGoBack());
      sendToAllWindows('update-can-go-forward', view.webContents.canGoForward());
      updateAddress(url);
    }

    handleDidNavigateCompability(view.webContents, url);
  });

  view.webContents.on('did-navigate-in-page', (e, url) => {
    const workspaceObj = getWorkspace(workspace.id);
    // this event might be triggered
    // even after the workspace obj and BrowserView
    // are destroyed. See https://github.com/webcatalog/webcatalog-app/issues/836
    if (!workspaceObj) return;

    if (workspaceObj.active) {
      sendToAllWindows('update-can-go-back', view.webContents.canGoBack());
      sendToAllWindows('update-can-go-forward', view.webContents.canGoForward());
      updateAddress(url);
    }
  });

  view.webContents.on('page-title-updated', (e, title) => {
    const workspaceObj = getWorkspace(workspace.id);
    // this event might be triggered
    // even after the workspace obj and BrowserView
    // are destroyed. See https://github.com/webcatalog/webcatalog-app/issues/836
    if (!workspaceObj) return;

    if (workspaceObj.active) {
      sendToAllWindows('update-title', title);
      if (browserWindow && !browserWindow.isDestroyed()) {
        browserWindow.refreshTitle(title);
      }
    }
  });

  const buildContextMenu = (contents, openLinkInNewWindow) => {
    // Menu
    const contextMenuBuilder = new ContextMenuBuilder(
      contents,
      true,
    );

    contents.on('context-menu', (e, info) => {
      contextMenuBuilder.buildMenuForElement(info)
        .then((menu) => {
          const extensionMenuItems = extensions
            ? extensions.getContextMenuItems(contents, info) : [];
          if (extensionMenuItems.length > 0) {
            menu.append(new MenuItem({ type: 'separator' }));
            extensionMenuItems.forEach((menuItem) => {
              menu.append(menuItem);
            });
          }

          const utmSource = getUtmSource();

          if (info.linkURL && info.linkURL.length > 0) {
            menu.append(new MenuItem({ type: 'separator' }));

            menu.append(new MenuItem({
              label: 'Open Link in New Window',
              click: () => {
                // trigger the 'new-window' event manually
                openLinkInNewWindow(
                  {
                    sender: contents,
                    preventDefault: () => {},
                  },
                  info.linkURL,
                  '', // frameName
                  'neutron:new-window-forced',
                );
              },
            }));

            menu.append(new MenuItem({ type: 'separator' }));

            const workspaces = getWorkspaces();

            const workspaceLst = Object.values(workspaces).sort((a, b) => a.order - b.order);

            menu.append(new MenuItem({
              label: `Open Link in New ${getWorkspaceFriendlyName()}`,
              click: () => {
                ipcMain.emit('request-open-url-in-workspace', null, info.linkURL);
              },
            }));
            menu.append(new MenuItem({ type: 'separator' }));

            workspaceLst.forEach((w) => {
              const workspaceName = w.name || `${getWorkspaceFriendlyName()} ${w.order + 1}`;
              menu.append(new MenuItem({
                label: `Open Link in ${workspaceName}`,
                click: () => {
                  ipcMain.emit('request-open-url-in-workspace', null, info.linkURL, w.id);
                },
              }));
            });
          }

          menu.append(new MenuItem({ type: 'separator' }));

          menu.append(new MenuItem({
            label: 'Back',
            enabled: contents.canGoBack(),
            click: () => {
              contents.goBack();
            },
          }));
          menu.append(new MenuItem({
            label: 'Forward',
            enabled: contents.canGoForward(),
            click: () => {
              contents.goForward();
            },
          }));
          menu.append(new MenuItem({
            label: 'Reload',
            click: () => {
              contents.reload();
            },
          }));

          menu.append(new MenuItem({ type: 'separator' }));

          const currentUrl = info.linkURL || contents.getURL();
          if (currentUrl) {
            menu.append(
              new MenuItem({
                label: info.linkURL
                  ? `Set URL as ${getWorkspaceFriendlyName()}'s Home Page`
                  : `Set Current URL as ${getWorkspaceFriendlyName()}'s Home Page`,
                click: () => {
                  setWorkspace(workspace.id, {
                    homeUrl: currentUrl,
                  });
                },
              }),
            );
            menu.append(new MenuItem({ type: 'separator' }));
          }

          menu.append(new MenuItem({ type: 'separator' }));

          const sharedUrl = info.linkURL || contents.getURL();
          if (sharedUrl) {
            menu.append(
              new MenuItem({
                role: 'shareMenu',
                sharingItem: {
                  urls: [sharedUrl],
                },
              }),
            );
            menu.append(new MenuItem({ type: 'separator' }));
          }

          menu.append(
            new MenuItem({
              label: 'More',
              submenu: [
                {
                  label: 'About',
                  click: () => ipcMain.emit('request-show-preferences-window', null, 'about'),
                },
                { type: 'separator' },
                {
                  label: 'Check for Updates',
                  click: () => ipcMain.emit('request-check-for-updates'),
                  visible: !isMas() && !isSnap() && !isAppx(),
                },
                {
                  type: 'separator',
                  visible: !isMas() && !isSnap() && !isAppx(),
                },
                {
                  label: 'Preferences...',
                  click: () => ipcMain.emit('request-show-preferences-window'),
                },
                { type: 'separator' },
                isWebcatalog() ? {
                  label: 'WebCatalog Help',
                  click: () => shell.openExternal('https://help.webcatalog.app?utm_source=juli_app'),
                } : {
                  label: 'Help',
                  click: () => {
                    if (appJson.hostname) {
                      return shell.openExternal(`https://${appJson.hostname}/help?utm_source=${utmSource}`);
                    }
                    return shell.openExternal(`https://${appJson.id}.app/help?utm_source=${utmSource}`);
                  },
                },
                isWebcatalog() ? {
                  label: 'WebCatalog Website',
                  click: () => shell.openExternal('https://webcatalog.app?utm_source=juli_app'),
                } : {
                  label: 'Website',
                  click: () => {
                    if (appJson.hostname) {
                      return shell.openExternal(`https://${appJson.hostname}?utm_source=${utmSource}`);
                    }
                    return shell.openExternal(`https://${appJson.id}.app?utm_source=${utmSource}`);
                  },
                },
                { type: 'separator' },
                {
                  label: 'Quit',
                  click: () => ipcMain.emit('request-quit'),
                },
              ],
            }),
          );

          menu.popup({
            window: BrowserWindow.fromWebContents(contents),
          });
        });
    });
  };

  const handleNewWindow = (
    e,
    nextUrl,
    frameName,
    disposition,
    options,
    additionalFeatures,
    referrer,
    postBody,
  ) => {
    const appUrl = getWorkspace(workspace.id).homeUrl || appJson.url;
    const appDomain = extractDomain(appUrl);
    const currentUrl = e.sender.getURL();
    const currentDomain = extractDomain(currentUrl);
    const nextDomain = extractDomain(nextUrl);

    const openInNewWindow = (forced) => {
      // https://gist.github.com/Gvozd/2cec0c8c510a707854e439fb15c561b0
      e.preventDefault();

      // use user preference unless the action is forced
      if (!forced) {
        const alwaysOpenInMainWindow = getWorkspacePreference(workspace.id, 'alwaysOpenInMainWindow') == null
          ? getPreference('alwaysOpenInMainWindow')
          : getWorkspacePreference(workspace.id, 'alwaysOpenInMainWindow');
        if (alwaysOpenInMainWindow) {
          e.sender.loadURL(nextUrl);
          return;
        }
      }

      // have to use options.webContents
      // because if not, it would break certain sites, such as Gmail
      // but avoid using it when opening Google Meet/Google login link
      // because somehow options.webContents doesn't let us configure UA
      const useProvidedOptions = options && options.webContents && nextDomain !== 'meet.google.com';
      const newOptions = useProvidedOptions ? options : {
        show: true,
        width: options && options.width ? options.width : 1366,
        height: options && options.width ? options.height : 768,
        x: options && options.x ? options.x : undefined,
        y: options && options.y ? options.y : undefined,
        webPreferences: sharedWebPreferences,
      };

      // customize popup window
      // based on user preferences
      if (getPreference('popupFrameless')) {
        newOptions.frame = false;
      } else if (!getPreference('popupTitleBar')) {
        newOptions.titleBarStyle = 'hidden';
      }

      const popupWin = new BrowserWindow(newOptions);
      // WebCatalog internal value to determine whether BrowserWindow is popup
      popupWin.isPopup = true;
      popupWin.webContents.isPopup = true;
      popupWin.setMenuBarVisibility(false);
      popupWin.webContents.on('new-window', handleNewWindow);
      popupWin.webContents.on('did-navigate', (_, url) => {
        handleDidNavigateCompability(popupWin.webContents, url);
      });
      buildContextMenu(popupWin.webContents, handleNewWindow);

      // if options.webContents is not used
      // loadURL won't be triggered automatically
      if (!useProvidedOptions) {
        const loadOptions = {};
        if (referrer) {
          loadOptions.httpReferrer = referrer;
        }
        if (postBody != null) {
          const { data, contentType, boundary } = postBody;
          loadOptions.postData = data;
          loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
        }
        popupWin.loadURL(nextUrl, loadOptions);
      }

      e.newGuest = popupWin;
    };

    // 'neutron:new-window-forced' // use internally by Neutron to force opening new window
    if (disposition === 'neutron:new-window-forced') {
      openInNewWindow(true);
      return;
    }

    // Conditions are listed by order of priority
    // check external rule
    // https://docs.webcatalog.io/article/43-how-to-define-external-urls
    const externalUrlRule = getWorkspacePreference(workspace.id, 'externalUrlRule') || getPreference('externalUrlRule');
    if (nextUrl && externalUrlRule) {
      const re = new RegExp(`^${externalUrlRule}$`, 'i');
      if (re.test(nextUrl)) {
        e.preventDefault();
        shell.openExternal(nextUrl);
        return;
      }
    }

    // check defined internal URL rule
    // https://webcatalog.app/internal-urls
    const internalUrlRule = getWorkspacePreference(workspace.id, 'internalUrlRule') || getPreference('internalUrlRule');
    if (nextUrl && internalUrlRule) {
      const re = new RegExp(`^${internalUrlRule}$`, 'i');
      if (re.test(nextUrl)) {
        openInNewWindow();
        return;
      }
    }

    // regular new-window event
    // or if in Google Drive app, open Google Docs files internally https://github.com/webcatalog/webcatalog-app/issues/800
    // the next external link request will be opened in new window
    if (
      disposition === 'new-window'
      || disposition === 'default'
      || (appDomain === 'drive.google.com' && nextDomain === 'docs.google.com')
    ) {
      openInNewWindow();
      return;
    }

    // load in same window
    if (
      // https://app.slack.com/free-willy/: Slack call -> should still be opened in new window
      (appDomain && nextDomain && appDomain.endsWith('slack.com') && nextDomain.endsWith('slack.com') && !nextUrl.startsWith('https://app.slack.com/free-willy/'))
      // Google: Add account
      || nextDomain === 'accounts.google.com'
      // Google: Switch account
      || (
        nextDomain && nextDomain.indexOf('google.com') > 0
        && isInternalUrl(nextUrl, [appUrl, currentUrl])
        && (
          (nextUrl.indexOf('authuser=') > -1) // https://drive.google.com/drive/u/1/priority?authuser=2 (has authuser query)
          || (/\/u\/[0-9]+\/{0,1}$/.test(nextUrl)) // https://mail.google.com/mail/u/1/ (ends with /u/1/)
        )
      )
      // https://github.com/webcatalog/webcatalog-app/issues/315
      || (appDomain && nextDomain && (appDomain.includes('asana.com') || currentDomain.includes('asana.com')) && nextDomain.includes('asana.com'))
      // handle OneDrive login URL
      // https://github.com/webcatalog/webcatalog-app/issues/1250
      || (nextUrl && nextUrl.startsWith('https://go.microsoft.com/fwlink/p/?LinkID=2119709'))
      || (nextUrl && nextUrl.startsWith('https://go.microsoft.com/fwlink/p/?LinkID=2116067'))
    ) {
      e.preventDefault();
      e.sender.loadURL(nextUrl);
      return;
    }

    // open new window if the link is internal
    if (isInternalUrl(nextUrl, [appUrl, currentUrl])) {
      openInNewWindow();
      return;
    }

    // special case for Roam Research
    // if popup window is not opened and loaded, Roam crashes (shows white page)
    // https://github.com/webcatalog/webcatalog-app/issues/793
    if (
      appDomain === 'roamresearch.com'
      && nextDomain != null
      && (disposition === 'foreground-tab' || disposition === 'background-tab')
    ) {
      e.preventDefault();
      shell.openExternal(nextUrl);

      // mock window
      // close as soon as it did-navigate
      const newOptions = {
        ...options,
        show: false,
      };
      const popupWin = new BrowserWindow(newOptions);
      popupWin.once('did-navigate', () => {
        popupWin.close();
      });
      e.newGuest = popupWin;
      return;
    }

    // open external url in browser
    if (
      nextDomain != null
      && (disposition === 'foreground-tab' || disposition === 'background-tab')
    ) {
      e.preventDefault();
      shell.openExternal(nextUrl);
      return;
    }

    // App tries to open external link using JS
    // nextURL === 'about:blank' but then window will redirect to the external URL
    // https://github.com/webcatalog/webcatalog-app/issues/467#issuecomment-569857721
    if (
      nextDomain === null
      && (disposition === 'foreground-tab' || disposition === 'background-tab')
    ) {
      e.preventDefault();
      const newOptions = {
        ...options,
        show: false,
      };
      const popupWin = new BrowserWindow(newOptions);
      buildContextMenu(popupWin.webContents, handleNewWindow);
      // WebCatalog internal value to determine whether BrowserWindow is popup
      popupWin.isPopup = true;
      popupWin.webContents.isPopup = true;
      popupWin.setMenuBarVisibility(false);
      popupWin.webContents.on('new-window', handleNewWindow);
      popupWin.webContents.once('will-navigate', (_, url) => {
        // if the window is used for the current app, then use default behavior
        if (isInternalUrl(url, [appUrl, currentUrl])) {
          popupWin.show();
        } else { // if not, open in browser
          e.preventDefault();
          shell.openExternal(url);
          popupWin.close();
        }
      });
      popupWin.webContents.on('did-navigate', (_, url) => {
        handleDidNavigateCompability(popupWin.webContents, url);
      });
      e.newGuest = popupWin;
    }
  };
  view.webContents.on('new-window', handleNewWindow);

  // Handle downloads
  // https://electronjs.org/docs/api/download-item
  const willDownloadListener = (event, item) => {
    const globalPreferences = getPreferences();
    const workspacePreferences = getWorkspacePreferences(workspace.id);
    const downloadPath = workspacePreferences.downloadPath || globalPreferences.downloadPath;
    const askForDownloadPath = (workspacePreferences.askForDownloadPath != null
      ? workspacePreferences.askForDownloadPath
      : globalPreferences.askForDownloadPath) || global.forceSaveAs;
    // use for "save image as..." feature
    global.forceSaveAs = false;

    const options = {
      directory: downloadPath,
      saveAs: askForDownloadPath,
      // on macOS, if the file is downloaded to default Download dir
      // we bounce the dock icon
      openFolderWhenDone: globalPreferences.openFolderWhenDoneDownloading,
    };
    const callback = () => {};

    /* electron-dl port start */
    // https://github.com/sindresorhus/electron-dl
    downloadItems.add(item);
    totalBytes += item.getTotalBytes();

    const directory = options.directory || app.getPath('downloads');
    let filePath;
    if (options.filename) {
      filePath = path.join(directory, options.filename);
    } else {
      const filename = item.getFilename();
      const name = path.extname(filename)
        ? filename : getFilenameFromMime(filename, item.getMimeType());
      filePath = unusedFilename.sync(path.join(directory, name));
    }

    const errorMessage = options.errorMessage || 'The download of {filename} was interrupted';

    if (!options.saveAs) {
      item.setSavePath(filePath);
    }

    if (options.saveAs) {
      item.setSaveDialogOptions({ defaultPath: filePath });
    }

    if (typeof options.onStarted === 'function') {
      options.onStarted(item);
    }

    item.on('updated', () => {
      receivedBytes = [...downloadItems].reduce((receivedBytes_, item_) => {
        receivedBytes_ += item_.getReceivedBytes();
        return receivedBytes_;
      }, completedBytes);

      if (options.showBadge && ['darwin', 'linux'].includes(process.platform)) {
        app.badgeCount = activeDownloadItems();
      }

      if (!browserWindow.isDestroyed()) {
        browserWindow.setProgressBar(progressDownloadItems());
      }

      if (typeof options.onProgress === 'function') {
        const itemTransferredBytes = item.getReceivedBytes();
        const itemTotalBytes = item.getTotalBytes();

        options.onProgress({
          percent: itemTotalBytes ? itemTransferredBytes / itemTotalBytes : 0,
          transferredBytes: itemTransferredBytes,
          totalBytes: itemTotalBytes,
        });
      }
    });

    item.on('done', (_, state) => {
      completedBytes += item.getTotalBytes();
      downloadItems.delete(item);

      if (options.showBadge && ['darwin', 'linux'].includes(process.platform)) {
        app.badgeCount = activeDownloadItems();
      }

      if (!browserWindow.isDestroyed() && !activeDownloadItems()) {
        browserWindow.setProgressBar(-1);
        receivedBytes = 0;
        completedBytes = 0;
        totalBytes = 0;
      }

      if (options.unregisterWhenDone) {
        session.removeListener('will-download', willDownloadListener);
      }

      if (state === 'cancelled') {
        if (typeof options.onCancel === 'function') {
          options.onCancel(item);
        }
      } else if (state === 'interrupted') {
        const message = pupa(errorMessage, { filename: path.basename(item.getSavePath()) });
        callback(new Error(message));
      } else if (state === 'completed') {
        if (process.platform === 'darwin') {
          app.dock.downloadFinished(item.getSavePath());
        }

        if (options.openFolderWhenDone) {
          shell.showItemInFolder(item.getSavePath());
        }

        callback(null, item);
      }
    });
    /* electron-dl port end */
  };
  view.webContents.session.on('will-download', willDownloadListener);

  // Unread count badge
  if (getPreference('unreadCountBadge')) {
    view.webContents.usePageTitle = true;
    view.webContents.on('page-title-updated', (e, title) => {
      if (!view.webContents.usePageTitle) return;
      const num = getBadgeCountFromTitle(title);
      setWorkspaceBadgeCount(workspace.id, num);
    });
  }

  buildContextMenu(view.webContents, handleNewWindow);

  // Find In Page
  view.webContents.on('found-in-page', (e, result) => {
    sendToAllWindows('update-find-in-page-matches', result.activeMatchOrdinal, result.matches);
  });

  // Link preview
  view.webContents.on('update-target-url', (e, url) => {
    try {
      view.webContents.send('update-target-url', url);
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
    }
  });

  // Handle audio & notification preferences
  if (shouldMuteAudio !== undefined) {
    view.webContents.audioMuted = shouldMuteAudio;
  }
  view.webContents.once('did-stop-loading', () => {
    view.webContents.send('should-pause-notifications-changed', workspace.disableNotifications || shouldPauseNotifications);
  });

  view.openInNewWindow = (url) => {
    // trigger the 'new-window' event manually
    handleNewWindow(
      {
        sender: view.webContents,
        preventDefault: () => {},
      },
      url,
      '', // frameName
      'neutron:new-window-forced',
    );
  };

  views[viewId] = view;

  if (workspace.active) {
    browserWindow.setBrowserView(view);

    const contentSize = browserWindow.getContentSize();
    view.setBounds(getViewBounds(contentSize));
    view.setAutoResize({
      width: true,
      height: true,
    });
  } else if (global.hibernateWhenUnused && global.hibernateWhenUnusedTimeout > 0) {
    ipcMain.emit('request-hibernate-workspace', null, workspace.id, global.hibernateWhenUnusedTimeout);
  }

  const initialUrl = (global.rememberLastPageVisited && workspace.lastUrl)
  || workspace.homeUrl || appJson.url;
  if (initialUrl) {
    view.webContents.loadURL(initialUrl);
  }
};

const getView = (id) => views[id];

const setActiveView = (browserWindow, id) => {
  // stop find in page when switching workspaces
  const currentView = browserWindow.getBrowserView();
  if (currentView) {
    currentView.webContents.stopFindInPage('clearSelection');
    browserWindow.send('close-find-in-page');

    const appLockWhenSwitchingWorkspace = getPreference('appLockWhenSwitchingWorkspace');
    if (appLockWhenSwitchingWorkspace) {
      ipcMain.emit('request-lock-app');
    }
  }

  if (views[id] == null) {
    addViewAsync(browserWindow, getWorkspace(id));
  } else {
    const view = views[id];
    browserWindow.setBrowserView(view);

    const contentSize = browserWindow.getContentSize();
    if (getWorkspaceMeta(id).didFailLoad) {
      view.setBounds(
        getViewBounds(contentSize, false, 0, 0),
      ); // hide browserView to show error message
    } else {
      view.setBounds(getViewBounds(contentSize));
    }
    view.setAutoResize({
      width: true,
      height: true,
    });

    // focus on webview
    // https://github.com/webcatalog/webcatalog-app/issues/398
    if (browserWindow.isFocused()) {
      view.webContents.focus();
    }

    updateAddress(view.webContents.getURL());
    sendToAllWindows('update-title', view.webContents.getTitle());
    sendToAllWindows('update-can-go-back', view.webContents.canGoBack());
    sendToAllWindows('update-can-go-forward', view.webContents.canGoForward());
    browserWindow.refreshTitle(view.webContents.getTitle());
  }
};

const realignActiveView = (browserWindow, activeId) => {
  const attachedView = browserWindow.getBrowserView();
  const view = getView(activeId);

  // if attachedView refers to same active object
  // then we can skip this to avoid flickering
  if (attachedView !== view) {
    browserWindow.setBrowserView(view);
  }

  if (view && view.webContents) {
    const contentSize = browserWindow.getContentSize();
    if (getWorkspaceMeta(activeId).didFailLoad) {
      view.setBounds(
        getViewBounds(contentSize, false, 0, 0),
      ); // hide browserView to show error message
    } else {
      view.setBounds(getViewBounds(contentSize));
    }
  }
};

const removeView = (id) => {
  const view = views[id];
  if (view != null) {
    // end webContents so BrowserView can be cleaned with GC
    // https://github.com/electron/electron/pull/23578#issuecomment-703754455
    view.webContents.forcefullyCrashRenderer();
  }
  session.fromPartition(`persist:${id}`).clearStorageData();
  delete views[id];

  if (!global.shareWorkspaceBrowsingData) {
    delete extensionManagers[`persist:${id}`];
  }
};

const setViewsAudioPref = (_shouldMuteAudio) => {
  if (_shouldMuteAudio !== undefined) {
    shouldMuteAudio = _shouldMuteAudio;
  }
  const muteApp = getPreference('muteApp');
  Object.keys(views).forEach((id) => {
    const view = views[id];
    if (view != null) {
      const workspace = getWorkspace(id);
      view.webContents.audioMuted = workspace.disableAudio || shouldMuteAudio || muteApp;
    }
  });
};

const setViewsNotificationsPref = (_shouldPauseNotifications) => {
  if (_shouldPauseNotifications !== undefined) {
    shouldPauseNotifications = _shouldPauseNotifications;
  }
  Object.keys(views).forEach((id) => {
    const view = views[id];
    if (view != null) {
      const workspace = getWorkspace(id);
      view.webContents.send(
        'should-pause-notifications-changed',
        Boolean(workspace.disableNotifications || shouldPauseNotifications),
      );
    }
  });
};

const hibernateView = (id) => {
  const view = views[id];
  if (view != null) {
    // end webContents so BrowserView can be cleaned with GC
    // https://github.com/electron/electron/pull/23578#issuecomment-703754455
    view.webContents.forcefullyCrashRenderer();
  }
  delete views[id];
};

const reloadViewDarkReader = (id) => {
  const view = views[id];
  if (view != null) {
    view.webContents.send('reload-dark-reader');
  }
};

const reloadViewsDarkReader = () => {
  Object.keys(views).forEach((id) => {
    reloadViewDarkReader(id);
  });
};

const reloadViewsWebContentsIfDidFailLoad = () => {
  const metas = getWorkspaceMetas();
  Object.keys(metas).forEach((id) => {
    if (!metas[id].didFailLoad) return;

    const view = views[id];
    if (view != null) {
      view.webContents.reload();
    }
  });
};

const reloadView = (id) => {
  const view = views[id];
  if (view != null) {
    view.webContents.reload();
  }
};

const destroyAllViews = () => {
  Object.keys(views)
    .filter((id) => views[id] != null)
    .forEach((id) => {
      views[id].webContents.forcefullyCrashRenderer();
      delete views[id];
    });
};

module.exports = {
  addViewAsync,
  getView,
  destroyAllViews,
  hibernateView,
  realignActiveView,
  reloadView,
  reloadViewDarkReader,
  reloadViewsDarkReader,
  reloadViewsWebContentsIfDidFailLoad,
  removeView,
  setActiveView,
  setViewsAudioPref,
  setViewsNotificationsPref,
};
