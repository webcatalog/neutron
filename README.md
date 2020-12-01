# WebCatalog Engine [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|Linux|Windows|
|---|---|---|
|[![GitHub Actions macOS Build Status](https://github.com/webcatalog/webcatalog-engine/workflows/macOS/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3AmacOS)|[![GitHub Actions Linux Build Status](https://github.com/webcatalog/webcatalog-engine/workflows/Linux/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3ALinux)|[![GitHub Actions Windows Build Status](https://github.com/webcatalog/webcatalog-engine/workflows/Windows/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3AWindows)|

This powers the *WebCatalog Engine (Electron)*-based apps you install from [WebCatalog](https://webcatalog.app).

---

## Development
This repository only contains the source code of the [WebCatalog Engine](https://help.webcatalog.app/article/23-what-is-webcatalog-engine) - the core that powers the apps created with WebCatalog. If you'd like to contribute to the WebCatalog app, check out <https://github.com/webcatalog/webcatalog-app>.

```bash
# clone the project:
git clone https://github.com/webcatalog/webcatalog-engine.git
cd webcatalog-engine
```

For the app to be fully functional, set these environment variables:
```
REACT_APP_AMPLITUDE_API_KEY=
REACT_APP_SWIFTYPE_HOST_ID=
REACT_APP_SWIFTYPE_SEARCH_KEY=
REACT_APP_SWIFTYPE_ENGINE_NAME=
```

Modify `public/app.json` to change template app configuration. For example:
```json
{
  "id": "gmail",
  "name": "Gmail",
  "url": "https://mail.google.com"
}
```

```bash
# install the dependencies
yarn

# Run development mode
yarn electron-dev

# Package template app as zip file
yarn dist
```