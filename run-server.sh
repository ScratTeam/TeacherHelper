#!/bin/bash

# 拷贝证书文件
cd pack
if [ ! -d "ssl" ]; then
  mkdir ssl
fi
sudo cp /etc/letsencrypt/live/scrat.pw/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/scrat.pw/privkey.pem ssl/

# 重启服务器并退出
sudo pkill -f node
sudo npm install
sudo node https-server.js & (sleep 10 && exit)