#!/bin/bash

echo " *** Script startup.sh START ***"

cd /usr/src/app

if [ "${NODE_ENV}" = "production" ]; then
    echo "starting prod";
    yarn run build als-vendor && yarn run start:prod-vendor 
    echo "Builds Created";
elif [ "${NODE_ENV}" = "dev" ]; then
    echo "Starting dev";
    yarn run start:dev als-vendor 
    echo "Development started";
fi