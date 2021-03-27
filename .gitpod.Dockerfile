#!/bin/echo docker build . -f
# -*- coding: utf-8 -*-

FROM gitpod/workspace-full:latest

ARG BUILD_DATE="$(git rev-parse --short HEAD)"
ARG VCS_REF="$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")"
ARG VERSION="1.0.0"
ARG HOME_DIR="/home/gitpod"

LABEL maintainer="Alexander Rogalskiy <hi@nullables.io>"
LABEL organization="nullables.io"
LABEL io.nullables.typescript-tools.build-date=$BUILD_DATE
LABEL io.nullables.typescript-tools.name="typescript-tools"
LABEL io.nullables.typescript-tools.description="Typescript tools & utilities"
LABEL io.nullables.typescript-tools.url="https://nullables.io/"
LABEL io.nullables.typescript-tools.vcs-ref=$VCS_REF
LABEL io.nullables.typescript-tools.vcs-url="https://github.com/AlexRogalskiy/quotes"
LABEL io.nullables.typescript-tools.vendor="Nullables.io"
LABEL io.nullables.typescript-tools.version=$VERSION

# Docker build does not rebuild an image when a base image is changed, increase this counter to trigger it.
ENV TRIGGER_REBUILD 3

ENV NODE_VERSION="12.14.1"
ENV LC_ALL en_US.UTF-8
ENV LANG $LC_ALL
ENV HOME $HOME_DIR

USER root
RUN sudo echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

## Disable coredump
RUN sudo /bin/su -c "echo 'Set disable_coredump false' >> /etc/sudo.conf"

RUN sudo apt-get update && \
  sudo apt-get -y install \
    libgtkextra-dev \
    libgconf2-dev \
    libnss3 \
    libasound2 \
    libxtst-dev \
    libxss1 \
    libxss-dev \
    libx11-dev \
    libxkbfile-dev \
    software-properties-common \
    build-essential \
    xvfb \
    curl \
    libgtk-3-0 \
    unzip

RUN bash -c ". .nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && npm install -g yarn"

ENV PATH=$HOME/.nvm/versions/node/v${NODE_VERSION}/bin:$PATH

USER gitpod

WORKDIR $HOME
