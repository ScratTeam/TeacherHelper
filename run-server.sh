#!/bin/bash
cp -r ssl pack
sudo pkill -f node
cd pack
npm install
sudo node https-server.js
