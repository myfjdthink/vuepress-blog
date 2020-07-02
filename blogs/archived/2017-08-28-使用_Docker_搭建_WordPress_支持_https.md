---
title: 使用 Docker 搭建 WordPress 支持 https
date: 2017-08-28
tags:
 - posts
 - 编程相关
 - docker
categories: 
 - Archived
---
# 使用 Docker 搭建 WordPress 支持 https



最近把 WordPress 迁移到了腾讯云，为了配置方便使用了 docker 来运行，这里记录下配置过程

## 准备 compose 文件

WordPress 的 [docker compose 文件](https://docs.docker.com/compose/wordpress/#define-the-project)网上有很多，需要一个 mysql 的镜像，还有 WordPress 的镜像，大概长这样：

```
version: '3'services:   db:     image: mysql:5.7     volumes:       - db_data:/var/lib/mysql     restart: always     environment:       MYSQL_ROOT_PASSWORD: somewordpress       MYSQL_DATABASE: wordpress       MYSQL_USER: wordpress       MYSQL_PASSWORD: wordpress   wordpress:     depends_on:       - db     image: wordpress:latest     ports:       - "8000:80"     restart: always     environment:       WORDPRESS_DB_HOST: db:3306       WORDPRESS_DB_USER: wordpress       WORDPRESS_DB_PASSWORD: wordpressvolumes:    db_data:
```

## 定制 Dockerfile 添加 https 支持

借助于 letsencrypt 这个项目， 给个人网站添加 letsencrypt 变得十分容易，详细见这篇文章： 

[如何免费的让网站启用HTTPS](https://coolshell.cn/articles/18094.html)

大概流程就是安装一个软件包 letsencrypt ，然后配置你的网站信息即可，但是我们的 WordPress 是安装在 docker 里面，所以我们要想办法把这个软件包打进镜像里面。

接下来我们要对 WordPress 这个镜像进行自定义，参考这篇文章： 

[docker + wordpress + letsencrypt](https://breeto.id.au/2017/03/docker-wordpress-letsencrypt/)

先定制 Dockerfile，集成 letsencrypt 

新建文件夹 wordpress_tls 添加 Dockerfile

```
FROM wordpress:php7.1RUN echo "export TERM=xterm LANG=en_US.UTF-8" >> ~/.bashrc \    && apt-get update && apt-get -y install git \    && rm -rf "/opt/letsencrypt" \    && git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt \    && cd /opt/letsencrypt \    && ./letsencrypt-auto --version
```

wordpress 官方镜像使用的 ubuntu 源是国外源，打包镜像的速度会让你怀疑人生。可以把宿主机的 ubuntu 源放进 docker 镜像里。 

`$cp /etc/apt/sources.list ./`

修改 Dockerfile

```
FROM wordpress:php7.1ADD sources.list /etc/apt/sources.listRUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys \    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32 // 改成你的 keyRUN echo "export TERM=xterm LANG=en_US.UTF-8" >> ~/.bashrc \    && apt-get update && apt-get -y install git \    && rm -rf "/opt/letsencrypt" \    && git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt \    && cd /opt/letsencrypt \    && ./letsencrypt-auto --version
```

添加新的源会有认证的问题，可以参考 [http://naveenubuntu.blogspot.com/2011/08/fixing-gpg-keys-in-ubuntu.html](http://naveenubuntu.blogspot.com/2011/08/fixing-gpg-keys-in-ubuntu.html) 解决

## 配置 https

启动容器：

`$docker-compose up -d`

然后配置 https 

`$docker-compose exec wordpress_tls /opt/letsencrypt/certbot-auto --apache -d your.domain.com --agree-tos -n -m you@your.domain.com`

Let’s Encrypt 的证书90天就过期了，过期后执行

`$ docker-compose exec wordpress_tls /opt/letsencrypt/certbot-auto renew`

来更新，可以把更新脚本写进 crontab 

`$crontab -e`

```
0 0 1 * * docker-compose exec wordpress_tls /opt/letsencrypt/certbot-auto renew
```

## 完整示例

[https://github.com/myfjdthink/docker-wordpress](https://github.com/myfjdthink/docker-wordpress)


