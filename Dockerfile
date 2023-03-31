FROM node:16-alpine

COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm ci
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm run build --if-present
RUN rm -rf src

EXPOSE 3000

CMD [ "npm", "run", "start"]