# 多阶段构建 Dockerfile
# 第一阶段：构建应用
FROM node:alpine as builder

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_OPTIONS=--openssl-legacy-provider

# 复制 package 文件
COPY package.json ./
COPY pnpm-lock.yaml* ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 第二阶段：运行时镜像
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制静态文件到 nginx 目录
COPY --from=builder /app/public /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]