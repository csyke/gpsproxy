#!/bin/bash


killall gpsproxy.update.sh
./gpsproxy.update.sh &

npm install
node bin/app.js
