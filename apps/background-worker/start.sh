#!/bin/bash

echo " *** Script startup.sh START ***"

cd /usr/src/app

if [ "${NODE_ENV}" = "production" ]; then
    echo "starting prod";
    yarn run build background-worker && yarn run start:prod-worker
    echo "Builds Created";
elif [ "${NODE_ENV}" = "dev" ]; then
    echo "Starting dev";
    yarn run start:dev background-worker
    echo "Development started";
fi