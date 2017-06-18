#!/bin/bash

# 进入服务器的 screen
screen -r server

# 拷贝证书文件
cd pack
mkdir ssl
cp /etc/letsencrypt/live/scrat.pw/fullchain.pem ssl/
cp /etc/letsencrypt/live/scrat.pw/privkey.pem ssl/

# 重启服务器并退出
sudo pkill -f node
npm install
sudo node https-server.js & (sleep 1 && screen -d server)
exit