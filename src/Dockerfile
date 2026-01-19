# 使用官方 Node.js 镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml 文件到容器中
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制项目的其它文件
COPY . .

# 暴露容器的端口
EXPOSE 3100

# 启动项目
CMD ["pnpm", "run", "dev"]
