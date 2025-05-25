FROM node:20-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

COPY . .

RUN yarn build && \
    yarn install --frozen-lockfile --production && \
    yarn cache clean && \
    rm -rf src/ tests/ 

EXPOSE 3000

CMD ["yarn", "start:prod"] 