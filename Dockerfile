FROM node:lts-alpine as development
#
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:lts-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY .env ./

RUN yarn --prod
ENV TZ="Asia/Dhaka"

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]