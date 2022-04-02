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

- Install dependencies: `yarn`.
- Run development mode
  - in `template (WebCatalog)` mode: `yarn electron-dev`.
  - in `standalone` mode: `yarn electron-dev:standalone`.
  - in `Mac App Store` mode: `yarn electron-dev:mac-app-store`.
  - in `Microsoft Store` mode: `yarn electron-dev:appx`.
  - in `Snap` mode: `yarn electron-dev:snap`.
  - in `Skywhale (standalone)` mode: `yarn electron-dev:standalone:skywhale`.
  - in `Skywhale (Mac App Store)` mode: `yarn electron-dev:mac-app-store:skywhale`.

## Distribution
Release as/for:
  - template: `yarn release:template`.
  - Mac App Store: `yarn release:mac-app-store`.
  - APPX (Microsoft Store): `yarn release:appx`.
  - standalone: `yarn standalone`.