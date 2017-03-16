# mxabierto buda-crawler
# https://github.com/mxabierto/buda
# Build:
#   docker build -t iadb/edx-import .
# Usage:
#   docker run \
#   --env AWS_ACCESS_KEY_ID=... \
#   --env AWS_SECRET_ACCESS_KEY=... \
#   --env KEY_PASSPHRASE=... \
#   --env STORAGE_DB=edx \
#   --link STORAGE_ID:storage \
#   iadb/edx-import

FROM debian:jessie

MAINTAINER bcessa <ben@pixative.com>

ADD . /edx-import

WORKDIR /edx-import

RUN \
  # Basic deps
  apt-get update && \
  apt-get install -y \
    curl \
    python-pip \
    unzip \
    wget && \
  # Nodejs
  curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
  apt-get install -y nodejs && \
  # AWS CLI
  pip install awscli && \
  # Mongo tools
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 && \
  echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list && \
  apt-get update && \
  apt-get install -y \
    mongodb-org-shell \
    mongodb-org-tools && \
  # Local module
  npm install -g . && \
  chmod 775 /edx-import/run.sh

ENTRYPOINT ["/edx-import/run.sh"]
