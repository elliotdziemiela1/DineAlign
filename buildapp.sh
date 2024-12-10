#!/usr/bin/env bash
set -e

echo "Setting up server dependencies..."
cd ./server
npm install
rm -rf ./clientbuild || true

echo "Building frontend..."
cd ../client
npm install
npm run build
mv ./build ../server/clientbuild