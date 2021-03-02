/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  Menu,
  clipboard,
  ipcMain,
  shell,
} = require('electron');

const appJson = require('../constants/app-json');

const goToUrlWindow = require('../windows/go-to-url');
const mainWindow = require('../windows/main');

const isMas = require('./is-mas');
const isWindowsStore = require('./is-windows-store');
const getViewBounds = require('./get-view-bounds');
const getUtmSource = require('./get-utm-source');
const {
  setPreference,
  getPreference,
} = require('./preferences');

const {
  getWorkspaces,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
} = require('./workspaces');

const {
  createWorkspaceView,
  setActiveWorkspaceView,
} = require('./workspaces-views');

const {
  getView,
} = require('./views');

let menu;

const getWorkspaceName = (workspace) => {
  let workspaceName = `Workspace ${workspace.order + 1}`;
  if (workspace.name) workspaceName = workspace.name;
  else if (workspace.accountInfo) {
    if (workspace.accountInfo.name && workspace.accountInfo.email) {
      workspaceName = `${workspace.accountInfo.name} (${workspace.accountInfo.email})`;
    } else if (workspace.accountInfo.name) {
      workspaceName = workspace.accountInfo.name;
    }
  }
  return workspaceName;
};

const createMenu = async () => {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;
  const utmSource = getUtmSource();

  const handleZoomIn = (menuItem, browserWindow) => {
    // if item is called in popup window
    // open menu bar in the popup window instead
    if (browserWindow && browserWindow.isPopup) {
      const contents = browserWindow.webContents;
      contents.zoomFactor += 0.1;
      return;
    }

    const win = mainWindow.get();

    if (win != null) {
      const contents = win.getBrowserView().webContents;
      contents.zoomFactor += 0.1;
    }
  };

  const macMenuItems = [
    { type: 'separator' },
    { role: 'services', submenu: [] },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
  ];

  const lockMenuItems = Boolean(global.appLock) && !global.locked ? [
    {
      type: 'separator',
    },
    {
      label: 'Lock',
      click: () => ipcMain.emit('request-lock-app'),
    },
  ] : [];

  const muteApp = getPreference('muteApp');

  const template = [
    {
      label: appJson.name,
      submenu: [
        {
          label: `About ${appJson.name}`,
          click: () => ipcMain.emit('request-show-about-window'),
        },
        { type: 'separator' },
        ...lockMenuItems,
        {
          label: 'Check for Updates...',
          click: () => ipcMain.emit('request-check-for-updates'),
          visible: !isMas() && !isWindowsStore(),
        },
        {
          type: 'separator',
          visible: !isMas() && !isWindowsStore(),
        },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => ipcMain.emit('request-show-preferences-window'),
          enabled: !global.locked,
        },
        { type: 'separator' },
        {
          label: 'Notifications...',
          click: () => ipcMain.emit('request-show-notifications-window'),
          accelerator: 'CmdOrCtrl+Shift+N',
          enabled: !global.locked,
        },
        { type: 'separator' },
        {
          label: muteApp ? 'Unmute' : 'Mute',
          click: () => setPreference('muteApp', !muteApp),
          enabled: !global.locked,
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => ipcMain.emit('request-clear-browsing-data'),
          enabled: !global.locked,
        },
        ...macMenuItems,
        { type: 'separator' },
        {
          label: 'Warn Before Quitting',
          click: () => {
            setPreference('warnBeforeQuitting', !getPreference('warnBeforeQuitting'));
            createMenu();
          },
          type: 'checkbox',
          checked: getPreference('warnBeforeQuitting'),
        },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        {
          role: 'pasteandmatchstyle',
          // by default, it's 'Alt+Shift+CmdOrCtrl+V'
          accelerator: 'Shift+CmdOrCtrl+V',
        },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            const win = mainWindow.get();
            if (win) {
              win.webContents.focus();

              win.send('open-find-in-page');

              const contentSize = win.getContentSize();
              const view = win.getBrowserView();

              view.setBounds(getViewBounds(contentSize, true));
            }
          },
          enabled: !global.locked && hasWorkspaces,
        },
        {
          label: 'Find Next',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', true);
          },
          enabled: !global.locked && hasWorkspaces,
        },
        {
          label: 'Find Previous',
          accelerator: 'Shift+CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', false);
          },
          enabled: !global.locked && hasWorkspaces,
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: global.sidebar ? 'Hide Sidebar' : 'Show Sidebar',
          accelerator: 'CmdOrCtrl+Alt+S',
          click: () => {
            setPreference('sidebar', !global.sidebar);
            ipcMain.emit('request-realign-active-workspace');
          },
          enabled: !global.locked,
        },
        {
          label: global.navigationBar ? 'Hide Navigation Bar' : 'Show Navigation Bar',
          accelerator: 'CmdOrCtrl+Alt+N',
          enabled: !global.locked && !(process.platform === 'linux' && global.attachToMenubar && !global.sidebar),
          click: () => {
            setPreference('navigationBar', !global.navigationBar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        {
          label: global.titleBar ? 'Hide Title Bar' : 'Show Title Bar',
          accelerator: 'CmdOrCtrl+Alt+T',
          enabled: !global.locked && process.platform === 'darwin',
          visible: process.platform === 'darwin',
          click: () => {
            setPreference('titleBar', !global.titleBar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: (menuItem, browserWindow) => {
            // if item is called in popup window
            // open menu bar in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              const contents = browserWindow.webContents;
              contents.zoomFactor = 1;
              return;
            }

            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.zoomFactor = 1;
            }
          },
          enabled: !global.locked && hasWorkspaces,
        },
        // duplicate zooming in menuitem
        // as it's not posible to set multiple accelerators
        // https://github.com/webcatalog/webcatalog-app/issues/1015
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: handleZoomIn,
          enabled: !global.locked && hasWorkspaces,
          visible: false,
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: handleZoomIn,
          enabled: !global.locked && hasWorkspaces,
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: (menuItem, browserWindow) => {
            // if item is called in popup window
            // open menu bar in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              const contents = browserWindow.webContents;
              // // 'zoomFactor' must be a double greater than 0.0
              if (contents.zoomFactor.toFixed(1) !== '0.1') {
                contents.zoomFactor -= 0.1;
              }
              return;
            }

            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              // 'zoomFactor' must be a double greater than 0.0
              if (contents.zoomFactor.toFixed(1) !== '0.1') {
                contents.zoomFactor -= 0.1;
              }
            }
          },
          enabled: !global.locked && hasWorkspaces,
        },
        { type: 'separator' },
        {
          label: 'Reload This Page',
          accelerator: 'CmdOrCtrl+R',
          click: (menuItem, browserWindow) => {
            // if item is called in popup window
            // open menu bar in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              browserWindow.webContents.reload();
              return;
            }

            const win = mainWindow.get();

            if (win != null) {
              win.getBrowserView().webContents.reload();
            }
          },
          enabled: !global.locked && hasWorkspaces,
        },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          submenu: [],
        },
      ],
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Shift+CmdOrCtrl+H',
          click: () => ipcMain.emit('request-go-home'),
          enabled: !global.locked && hasWorkspaces,
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: (menuItem, browserWindow) => {
            // if back is called in popup window
            // navigate in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              browserWindow.webContents.goBack();
              return;
            }
            ipcMain.emit('request-go-back');
          },
          enabled: !global.locked && hasWorkspaces,
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: (menuItem, browserWindow) => {
            // if back is called in popup window
            // navigate in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              browserWindow.webContents.goBack();
              return;
            }
            ipcMain.emit('request-go-forward');
          },
          enabled: !global.locked && hasWorkspaces,
        },
        { type: 'separator' },
        {
          label: 'Copy URL',
          accelerator: 'CmdOrCtrl+L',
          click: (menuItem, browserWindow) => {
            // if back is called in popup window
            // copy the popup window URL instead
            if (browserWindow && browserWindow.isPopup) {
              const url = browserWindow.webContents.getURL();
              clipboard.writeText(url);
              return;
            }

            const win = mainWindow.get();

            if (win != null) {
              const url = win.getBrowserView().webContents.getURL();
              clipboard.writeText(url);
            }
          },
          enabled: !global.locked && hasWorkspaces,
        },
        { type: 'separator' },
        {
          label: 'Go to URL...',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => {
            goToUrlWindow.show();
          },
          enabled: !global.locked && hasWorkspaces,
        },
      ],
    },
    {
      label: 'Workspaces',
      submenu: [],
    },
    {
      role: 'window',
      submenu: [
        { role: 'close' },
        { role: 'minimize' },
        // role: 'zoom' is only supported on macOS
        process.platform === 'darwin' ? {
          role: 'zoom',
        } : {
          label: 'Zoom',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              win.maximize();
            }
          },
        },
        { type: 'separator' },
        { role: 'front' },
        {
          label: appJson.name,
          click: () => mainWindow.show(),
        },
      ],
    },
    {
      role: 'help',
      submenu: (isMas() || isWindowsStore()) ? [
        {
          label: 'Help',
          click: () => shell.openExternal(`https://${appJson.id}.app/help?utm_source=${utmSource}`),
        },
        {
          label: 'Website',
          click: () => shell.openExternal(`https://${appJson.id}.app?utm_source=${utmSource}`),
        },
      ] : [
        {
          label: 'WebCatalog Help',
          click: () => shell.openExternal(`https://help.webcatalog.app?utm_source=${utmSource}`),
        },
        {
          label: 'WebCatalog Website',
          click: () => shell.openExternal(`https://webcatalog.app?utm_source=${utmSource}`),
        },
      ],
    },
  ];

  // hide list of workspaces ogether when the app is locked
  // preventing unauthorized stalking
  if (!global.locked) {
    Object.values(getWorkspaces())
      .sort((a, b) => a.order - b.order)
      .forEach((workspace, i) => {
        const label = getWorkspaceName(workspace);
        template[4].submenu.push({
          label,
          type: 'checkbox',
          checked: workspace.active,
          click: () => {
            if (workspace.active) return;
            setActiveWorkspaceView(workspace.id);
            createMenu();
          },
          accelerator: i < 9 ? `CmdOrCtrl+${i + 1}` : null,
        });

        template[2].submenu[template[2].submenu.length - 1].submenu.push({
          label,
          click: () => {
            const v = getView(workspace.id);
            v.webContents.toggleDevTools();
          },
        });
      });
  }

  template[4].submenu.push(
    { type: 'separator' },
    {
      label: 'Select Next Workspace',
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const nextWorkspace = getNextWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(nextWorkspace.id);
        createMenu();
      },
      accelerator: 'CmdOrCtrl+Shift+]',
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Select Previous Workspace',
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const previousWorkspace = getPreviousWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(previousWorkspace.id);
        createMenu();
      },
      accelerator: 'CmdOrCtrl+Shift+[',
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: 'Edit Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-show-edit-workspace-window', null, activeWorkspace.id);
      },
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Configure Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-show-workspace-preferences-window', null, activeWorkspace.id);
      },
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Remove Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-remove-workspace', null, activeWorkspace.id);
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: (() => {
        let standardWorkspaceName = appJson.name;
        if (appJson.id === 'dynamail') standardWorkspaceName = 'Gmail';
        if (appJson.id === 'dynacal') standardWorkspaceName = 'Google Calendar';
        return `Add ${standardWorkspaceName} Workspace`;
      })(),
      click: () => {
        createWorkspaceView();
        createMenu();
      },
      visible: Boolean(appJson.url),
      enabled: !global.locked,
    },
    {
      label: appJson.url ? 'Add Custom Workspace' : 'Add Workspace',
      click: () => ipcMain.emit('request-show-add-workspace-window'),
      enabled: !global.locked,
      visible: appJson.id !== 'dynacal' && appJson.id !== 'dynamail',
    },
  );

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// https://dev.to/saisandeepvaddi/creating-a-custom-menu-bar-in-electron-1pi3
// Register an event listener.
// When ipcRenderer sends mouse click co-ordinates, show menu at that position.
const showMenu = (window, x, y) => {
  if (!menu) return;
  menu.popup({
    window,
    x,
    y,
  });
};

module.exports = {
  createMenu,
  showMenu,
};
