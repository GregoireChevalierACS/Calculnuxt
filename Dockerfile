FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

EXPOSE 3000

RUN npm install && \
npm run build

CMD ["npm", "run", "start"]