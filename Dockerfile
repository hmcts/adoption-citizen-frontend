# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:12-alpine as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
COPY package.json yarn.lock ./
RUN yarn install && yarn build:prod && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

# ---- Build image ----
FROM base as build
COPY tsconfig.json webpack.config.js ./
COPY --chown=hmcts:hmcts src/main ./src/main
RUN yarn install && yarn build:prod

# ---- Runtime image ----
FROM base as runtime
COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/tsconfig.json ./
COPY config ./config
EXPOSE 3000
