FROM node:21

WORKDIR /usr/app
copy package.json package.json
copy package-lock.json package-lock.json
RUN npm install

copy src src
