# 实时签到答题系统

## 团队成员

刘忍、舒倩、王资

## 系统概述

团队完成的是一个实时签到和答题系统。主要的用户分两类：学生和老师。老师可以创建课程，在课程内导入学生名单，然后在课程下创建问题。学生通过扫描二维码的方式进行签到和答题。

所有的交互都由浏览器完成，网站会运行在云服务器上。

## 所涉及的技术

1. 前端框架：[Angular 2](https://angular.io/)；
2. 前端命令行工具：[Angular CLI](https://cli.angular.io/)；
3. UI：[Angular 2 Material](https://material.angular.io/)；
4. 后对框架：[Koa](http://koajs.com/)；
5. 数据库：[MongoDB](https://www.mongodb.com/)；
6. 数据库辅助：[Mongoose](http://mongoosejs.com/)。

## 如何运行

1. 确保已安装较新版本的 Node 和 npm（参考：Node v7.8.0，npm v4.4.4）；
2. 安装 Angular CLI：```npm install -g @angular/cli```；
3. 将仓库克隆到本地：```git clone https://github.com/ScratTeam/TeacherHelper.git```；
4. 进入项目根路径；
5. 安装依赖：```npm install```；
6. 编译前端并运行后端：```ng build && node server.js```。如果想实时调试的话应使用 ```ng build --watch```，并在另一个命令行窗口内输入 ```node server.js```。
