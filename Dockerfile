FROM arm32v6/alpine
RUN apk update --no-cache && \
    apk add nodejs && \
    mkdir /www

EXPOSE 8080
COPY src /www/src
COPY node_modules /www/node_modules

WORKDIR /www
CMD ["node", "src/index.js"]
    