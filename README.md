# WebCatalog Engine [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|Linux|Windows|
|---|---|---|
|[![GitHub Actions macOS Build Status](https://github.com/webcatalog/webcatalog-engine/workflows/macOS/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3AmacOS)|[![GitHub Actions Linux Build Status](https://github.com/webcatalog/webcatalog-engine/workflows/Linux/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3ALinux)|[![GitHub Actions Windows Build Status](https://github.com/webcatalog/webcatalog-engine/workflows/Windows/badge.svg)](https://github.com/webcatalog/webcatalog-engine/actions?query=workflow%3AWindows)|

This powers the apps you install from [WebCatalog](https://webcatalog.app).

---

## Development
```
# First, clone the project:
git clone https://github.com/webcatalog/webcatalog-engine.git
cd juli

# install the dependencies
yarn

# Run development mode
yarn electron-dev

# Package template app as zip file
yarn dist
```