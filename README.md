# Juli [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](LICENSE)

|macOS|Linux|Windows|
|---|---|---|
|[![GitHub Actions macOS Build Status](https://github.com/atomery/juli/workflows/macOS/badge.svg)](https://github.com/atomery/juli/actions?query=workflow%3AmacOS)|[![GitHub Actions Linux Build Status](https://github.com/atomery/juli/workflows/Linux/badge.svg)](https://github.com/atomery/juli/actions?query=workflow%3ALinux)|[![GitHub Actions Windows Build Status](https://github.com/atomery/juli/workflows/Windows/badge.svg)](https://github.com/atomery/juli/actions?query=workflow%3AWindows)|

[WebCatalog](https://atomery.com/webcatalog) downloads and uses this Electron app template (aka Juli) under the hood to generate Electron-based apps locally.

[Singlebox](https://atomery.com/singlebox) is based solely on this app template with certain additional configurations.

---

## Development
```
# First, clone the project:
git clone https://github.com/atomery/juli.git
cd juli

# install the dependencies
yarn

# Run development mode
yarn electron-dev

# Package template app as zip file
yarn dist
```