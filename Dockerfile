# DOCKER-VERSION 1.2.0

FROM ubuntu

RUN apt-get update

RUN apt-get install -y nodejs npm git git-core

COPY ./ /src

RUN cd /src; npm install

EXPOSE 3001

CMD ["nodejs", "/src/index.js"]