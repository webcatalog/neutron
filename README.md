# Neutron [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS (x64)|Linux (x64)|Windows (x64)|
|---|---|---|
|[![macOS (x64)](https://github.com/webcatalog/neutron/workflows/macOS%20(x64)/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow%3A%22macOS+%28x64%29%22)|[![Linux (x64)](https://github.com/webcatalog/neutron/workflows/Linux%20(x64)/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow%3A%22Linux+%28x64%29%22)|[![Windows (x64)](https://github.com/webcatalog/neutron/workflows/Windows%20(x64)/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow%3A%22Windows+%28x64%29%22)|

|macOS (arm64)|Linux (arm64)|Windows (arm64)|
|---|---|---|
|[![macOS (arm64)](https://github.com/webcatalog/neutron/workflows/macOS%20(arm64)/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow%3A%22macOS+%28arm64%29%22)|[![Linux (arm64)](https://github.com/webcatalog/neutron/workflows/Linux%20(arm64)/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow%3A%22Linux+%28arm64%29%22)|[![Windows (arm64)](https://github.com/webcatalog/neutron/workflows/Windows%20(arm64)/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow%3A%22Windows+%28arm64%29%22)|


Neutron powers:
- WebCatalog: https://webcatalog.io/webcatalog/
- Singlebox: https://webcatalog.io/singlebox/
- Clovery: https://webcatalog.io/clovery/
- Skywhale: https://webcatalog.io/skywhale/

---

## Development
This repository only contains the source code of the [Neutron](https://docs.webcatalog.io/article/23-what-is-neutron) - the core that powers the apps created with WebCatalog. If you'd like to contribute to the WebCatalog app, check out <https://github.com/webcatalog/webcatalog-app>.

```bash
# clone the project:
git clone https://github.com/webcatalog/neutron.git
cd neutron
```

For the app to be fully functional, set these environment variables:
```
ELECTRON_APP_SENTRY_DSN=
REACT_APP_AMPLITUDE_API_KEY=
REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY=
REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT=
REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME=
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
```

- Run development mode in WebCatalog mode: `yarn electron-dev`.
- Run development mode in standalone mode: `yarn electron-dev:standalone`.
- Run development mode in Mac App Store mode: `yarn electron-dev:mas`.
- Run development mode in Microsoft Store mode: `yarn electron-dev:appx`.
- Run development mode in Snap mode: `yarn electron-dev:snap`.
- Run development mode in menu bar browser (standalone) mode: `yarn electron-dev:standalone-menubar-browser`.
- Run development mode in menu bar browser (Mac App Store) mode: `yarn electron-dev:mas-menubar-browser`.

## Distribution

```bash
# Package template app as zip file
yarn dist
```