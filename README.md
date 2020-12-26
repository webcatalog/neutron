# WebCatalog Engine [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS (x64)|Linux (x64)|Windows (x64)|
|---|---|---|
|[![macOS (x64)](https://github.com/webcatalog/webcatalog-engine/workflows/macOS%20(x64)/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3A%22macOS+%28x64%29%22)|[![Linux (x64)](https://github.com/webcatalog/webcatalog-engine/workflows/Linux%20(x64)/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3A%22Linux+%28x64%29%22)|[![Windows (x64)](https://github.com/webcatalog/webcatalog-engine/workflows/Windows%20(x64)/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3A%22Windows+%28x64%29%22)|

|macOS (arm64)|Linux (arm64)|Windows (arm64)|
|---|---|---|
|[![macOS (arm64)](https://github.com/webcatalog/webcatalog-engine/workflows/macOS%20(arm64)/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3A%22macOS+%28arm64%29%22)|[![Linux (arm64)](https://github.com/webcatalog/webcatalog-engine/workflows/Linux%20(arm64)/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3A%22Linux+%28arm64%29%22)|[![Windows (arm64)](https://github.com/webcatalog/webcatalog-engine/workflows/Windows%20(arm64)/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3A%22Windows+%28arm64%29%22)|


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