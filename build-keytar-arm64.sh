#!/usr/bin/env bash
# set -euox pipefail

# This whole script is a huge hack. There's an issue in keytar
# https://github.com/atom/node-keytar/issues/346, actually seems more like an
# issue in node prebuild with the combination of Electron, which causes x86_64
# keytar.node to end up in app-amd64.asar, when building a universal macOS app.
#
# In order to mitigate the issue, we compile keytar manually, tarball it, and
# put in the cache directory where npm rebuild will be looking for it.

# Prepare variables
ELECTRON_VERSION=$(yarn list electron | grep "electron@.*" | sed 's/^.*electron@//' | sed 's/^[ \t]*//;s/[ \t]*$//')
echo $ELECTRON_VERSION
KEYTAR_OUT=build/Release/keytar.node
ABI=$(node -p "require('node-abi').getAbi('$ELECTRON_VERSION', 'electron')")
KEYTAR_VERSION=$(npm ls keytar | grep "keytar@.*" | sed 's/^.*keytar@//'| sed 's/^[ \t]*//;s/[ \t]*$//')
KEYTAR_TAR_NAME="keytar-v$KEYTAR_VERSION-electron-v$ABI-darwin-arm64.tar.gz"
# npm prebuild-install prepends the filename with a short digest of the download URL
# * https://github.com/prebuild/prebuild/blob/master/util.js#L6
# * https://github.com/prebuild/prebuild-install/blob/master/util.js#L72
DIGEST=$(md5 -qs "https://github.com/atom/node-keytar/releases/download/v$KEYTAR_VERSION/$KEYTAR_TAR_NAME")
DIGEST=${DIGEST:0:6}
PREBUILDS_CACHE_DIR=$(npm config get cache)"/_prebuilds"

cd node_modules/keytar

# Cleanup existing build artefacts just in case
rm -rf build/Release prebuilds

# Compile keytar using node-gyp directly
SDKROOT=macosx npx node-gyp rebuild \
    --arch=arm64 \
    --runtime=electron \
    --dist-url=https://atom.io/download/electron \
    --target="$ELECTRON_VERSION" \
    --build_v8_with_gn=false

# Check the arch, should be arm64
lipo -archs $KEYTAR_OUT

# create tar
mkdir -p "$PREBUILDS_CACHE_DIR"
tar -zcvf "$PREBUILDS_CACHE_DIR/$DIGEST-$KEYTAR_TAR_NAME" $KEYTAR_OUT

# Should contain cached keytar prebuild
ls -la "$PREBUILDS_CACHE_DIR"/*keytar-v"$KEYTAR_VERSION"*

cd ../..
