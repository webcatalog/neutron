const {
  Menu,
  clipboard,
  ipcMain,
  shell,
} = require('electron');

const appJson = require('../app.json');

const aboutWindow = require('../windows/about');
const addWorkspaceWindow = require('../windows/add-workspace');
const editWorkspaceWindow = require('../windows/edit-workspace');
const goToUrlWindow = require('../windows/go-to-url');
const licenseRegistrationWindow = require('../windows/license-registration');
const mainWindow = require('../windows/main');
const notificationsWindow = require('../windows/notifications');
const preferencesWindow = require('../windows/preferences');

const getViewBounds = require('./get-view-bounds');
const formatBytes = require('./format-bytes');
const {
  getPreference,
  setPreference,
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

function createMenu() {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;
  const registered = getPreference('registered');
  const updaterEnabled = process.env.SNAP == null && !process.mas && !process.windowsStore;

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

  const template = [
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
          enabled: hasWorkspaces,
        },
        {
          label: 'Find Next',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', true);
          },
          enabled: hasWorkspaces,
        },
        {
          label: 'Find Previous',
          accelerator: 'Shift+CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', false);
          },
          enabled: hasWorkspaces,
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
        },
        {
          label: global.navigationBar ? 'Hide Navigation Bar' : 'Show Navigation Bar',
          accelerator: 'CmdOrCtrl+Alt+N',
          enabled: !(process.platform === 'linux' && global.attachToMenubar && !global.sidebar),
          click: () => {
            setPreference('navigationBar', !global.navigationBar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        {
          label: global.titleBar ? 'Hide Title Bar' : 'Show Title Bar',
          accelerator: 'CmdOrCtrl+Alt+T',
          enabled: process.platform === 'darwin',
          visible: process.platform === 'darwin',
          click: () => {
            setPreference('titleBar', !global.titleBar);
            ipcMain.emit('request-realign-active-workspace');
          },
        },
        // same behavior as BrowserWindow with autoHideMenuBar: true
        // but with addition to readjust BrowserView so it won't cover the menu bar
        {
          label: 'Toggle Menu Bar',
          visible: false,
          accelerator: 'Alt+M',
          enabled: process.platform === 'win32',
          click: (menuItem, browserWindow) => {
            // if back is called in popup window
            // open menu bar in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              browserWindow.setMenuBarVisibility(!browserWindow.isMenuBarVisible());
              return;
            }

            const win = mainWindow.get();
            win.setMenuBarVisibility(!win.isMenuBarVisible());
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
          enabled: hasWorkspaces,
        },
        // duplicate zooming in menuitem
        // as it's not posible to set multiple accelerators
        // https://github.com/webcatalog/webcatalog-app/issues/1015
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: handleZoomIn,
          enabled: hasWorkspaces,
          visible: false,
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: handleZoomIn,
          enabled: hasWorkspaces,
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: (menuItem, browserWindow) => {
            // if item is called in popup window
            // open menu bar in the popup window instead
            if (browserWindow && browserWindow.isPopup) {
              const contents = browserWindow.webContents;
              contents.zoomFactor -= 0.1;
              return;
            }

            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.zoomFactor -= 0.1;
            }
          },
          enabled: hasWorkspaces,
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
          enabled: hasWorkspaces,
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
          enabled: hasWorkspaces,
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
          enabled: hasWorkspaces,
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
          enabled: hasWorkspaces,
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
          enabled: hasWorkspaces,
        },
        { type: 'separator' },
        {
          label: 'Go to URL...',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => {
            goToUrlWindow.show();
          },
          enabled: hasWorkspaces,
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
        { role: 'minimize' },
        { role: 'close' },
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
        { type: 'separator' },
      ],
    },
    {
      role: 'help',
      submenu: appJson.id === 'singlebox' ? [
        {
          label: 'Singlebox Support',
          click: () => shell.openExternal('https://atomery.com/singlebox/support?utm_source=singlebox_app'),
        },
        {
          label: 'Report a Bug via GitHub...',
          click: () => shell.openExternal('https://github.com/atomery/singlebox/issues'),
        },
        {
          label: 'Request a New Feature via GitHub...',
          click: () => shell.openExternal('https://github.com/atomery/singlebox/issues/new?template=feature.md&title=feature%3A+'),
        },
        {
          label: 'Submit New App to Catalog...',
          click: () => shell.openExternal('https://forms.gle/redZCVMwkuhvuDtb9'),
        },
        {
          label: 'Learn More...',
          click: () => shell.openExternal('https://atomery.com/singlebox?utm_source=singlebox_app'),
        },
      ] : [
        {
          label: 'WebCatalog Support',
          click: () => shell.openExternal('https://webcatalog.app/support?utm_source=juli_app'),
        },
        {
          label: 'WebCatalog Website',
          click: () => shell.openExternal('https://webcatalog.app?utm_source=juli_app'),
        },
      ],
    },
  ];

  const updaterMenuItem = {
    label: 'Check for Updates...',
    click: () => ipcMain.emit('request-check-for-updates'),
    visible: updaterEnabled,
  };
  if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
    updaterMenuItem.label = 'Restart to Apply Updates...';
  } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
    updaterMenuItem.label = 'Downloading Updates...';
    updaterMenuItem.enabled = false;
  } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
    const { transferred, total, bytesPerSecond } = global.updaterObj.info;
    updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    updaterMenuItem.enabled = false;
  } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
    updaterMenuItem.label = 'Checking for Updates...';
    updaterMenuItem.enabled = false;
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: appJson.name,
      submenu: [
        {
          label: `About ${appJson.name}`,
          click: () => aboutWindow.show(),
        },
        { type: 'separator' },
        {
          label: registered ? 'Registered' : 'Registration...',
          enabled: !registered,
          click: registered ? null : () => licenseRegistrationWindow.show(),
          visible: appJson.id === 'singlebox',
        },
        {
          type: 'separator',
          visible: appJson.id === 'singlebox',
        },
        updaterMenuItem,
        {
          type: 'separator',
          visible: updaterEnabled,
        },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => preferencesWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Notifications...',
          click: () => notificationsWindow.show(),
          accelerator: 'CmdOrCtrl+Shift+N',
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => ipcMain.emit('request-clear-browsing-data'),
        },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  } else {
    template.unshift({
      label: 'File',
      submenu: [
        {
          label: 'About',
          click: () => aboutWindow.show(),
        },
        {
          type: 'separator',
          visible: appJson.id === 'singlebox',
        },
        {
          label: registered ? 'Registered' : 'Registration...',
          enabled: !registered,
          click: registered ? null : () => licenseRegistrationWindow.show(),
          visible: appJson.id === 'singlebox',
        },
        {
          type: 'separator',
          visible: appJson.id === 'singlebox',
        },
        updaterMenuItem,
        {
          type: 'separator',
          visible: updaterEnabled,
        },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => preferencesWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Notifications...',
          click: () => notificationsWindow.show(),
          accelerator: 'CmdOrCtrl+Shift+N',
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => ipcMain.emit('request-clear-browsing-data'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' },
      ],
    });
  }

  Object.values(getWorkspaces())
    .sort((a, b) => a.order - b.order)
    .forEach((workspace, i) => {
      template[4].submenu.push({
        label: workspace.name || `Workspace ${i + 1}`,
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
        label: workspace.name || `Workspace ${i + 1}`,
        click: () => {
          const v = getView(workspace.id);
          v.webContents.toggleDevTools();
        },
      });
    });

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
      enabled: hasWorkspaces,
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
      enabled: hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: 'Edit Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        editWorkspaceWindow.show(activeWorkspace.id);
      },
      enabled: hasWorkspaces,
    },
    {
      label: 'Remove Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-remove-workspace', null, activeWorkspace.id);
      },
      enabled: hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: `Add ${appJson.name} Workspace`,
      click: () => {
        createWorkspaceView();
        createMenu();
      },
      visible: Boolean(appJson.url),
    },
    {
      label: 'Add Custom Workspace',
      click: () => addWorkspaceWindow.show(),
    },
  );

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
