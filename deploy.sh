#!/bin/bash

##### 部署文件包 #####

# 创建文件夹
mkdir pack

# 编译 Angular
ng build --prod -aot
cp -r dist pack

# 复制必要文件
cp -r routes pack
cp https-server.js pack
cp package.json pack
cp package-lock.json
cp run-server.sh pack

##### 拷贝文件至服务器 #####
scp -r pack ubuntu@scrat.pw:~
ssh ubuntu@scrat.pw "sudo sh pack/run-server.sh"
