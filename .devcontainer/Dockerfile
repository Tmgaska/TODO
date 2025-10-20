#
# IB-Scheduler Development Dockerfile
#
FROM node:16-slim
LABEL description="IB-Scheduler Development Dockerfile"

RUN apt-get update &&\
    apt-get install -y git &&\
    npm install -g serve &&\
    npm install -g git &&\
    npm install -g npm@7 &&\
    npm install -g npm-check-updates