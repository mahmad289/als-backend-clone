#!/bin/sh

apk update && apk add --no-cache \
    g++ \
    chromium \
    chromium-chromedriver

echo "Script run!"
