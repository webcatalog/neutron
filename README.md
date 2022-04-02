# Neutron [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE) [![macOS (x64)](https://github.com/webcatalog/neutron/workflows/Test/badge.svg)](https://github.com/webcatalog/neutron/actions?query=workflow:%22Test%22)

The source code of the [Neutron](https://docs.webcatalog.io/article/23-what-is-neutron) - the core that powers:

- WebCatalog: https://webcatalog.io/webcatalog/
- Singlebox: https://webcatalog.io/singlebox/
- Clovery: https://webcatalog.io/clovery/
- Skywhale: https://webcatalog.io/skywhale/

## Development
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