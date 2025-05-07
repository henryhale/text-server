#!/usr/bin/env bash

set -euo pipefail

APP_NAME="text-server"
VERSION=$(git describe --tags --always)
COMMIT=$(git rev-parse HEAD)
BUILD_DIR="dist"
PLATFORMS=("linux/amd64" "linux/arm64" "darwin/amd64" "darwin/arm64" "windows/amd64" "windows/arm64")

echo "Building $APP_NAME version $VERSION..."

# clean previous builds
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

for PLATFORM in "${PLATFORMS[@]}"; do
    IFS="/" read -r GOOS GOARCH <<< "$PLATFORM"
    OUTPUT_NAME="${APP_NAME}-${VERSION}-${GOOS}-${GOARCH}"
    EXT=""

    if [ "$GOOS" == "windows" ]; then
        OUTPUT_NAME+=".exe"
        EXT=".zip"
    else
        EXT=".tar.gz"
    fi

    echo "Building for $GOOS/$GOARCH..."
    env GOOS=$GOOS GOARCH=$GOARCH go build -o "$BUILD_DIR/$OUTPUT_NAME" .

    ARCHIVE_NAME="${APP_NAME}-${VERSION}-${GOOS}-${GOARCH}${EXT}"

    if [ "$EXT" == ".zip" ]; then
        zip -j "$BUILD_DIR/$ARCHIVE_NAME" "$BUILD_DIR/$OUTPUT_NAME"
    else
        tar -czf "$BUILD_DIR/$ARCHIVE_NAME" -C "$BUILD_DIR" "$OUTPUT_NAME"
    fi

    rm "$BUILD_DIR/$OUTPUT_NAME"
done

echo "Build and packaging complete. Artifacts in $BUILD_DIR/"
