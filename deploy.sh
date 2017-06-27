#!/bin/bash

##### 部署文件包 #####

# 创建文件夹
echo "========== Initializing =========="
if [ ! -d "pack" ]; then
  mkdir pack
fi

# 编译 Angular
echo "=========== Packaging ============"
ng build --prod -aot
cp -r dist pack

# 复制必要文件
echo "========= Copying Files =========="
cp -r routes pack
cp https-server.js pack
cp package.json pack
cp package-lock.json
cp run-server.sh pack

##### 拷贝文件至服务器 #####
echo "==== Sending Files to Server ====="
echo "Please input password for Scrat Server: "
scp -r pack ubuntu@scrat.pw:~
ssh ubuntu@scrat.pw "sudo sh pack/run-server.sh"