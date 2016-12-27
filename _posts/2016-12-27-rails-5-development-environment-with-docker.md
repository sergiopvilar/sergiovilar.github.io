---
title: "Rails 5 development environment with Docker (plus Yarn)"
date:   2016-12-27 18:50:00
layout: post
---

I usually write about my experiments in pet projects and this post is a result of a lot of experiments to finally get an acceptable result for a Rails 5 development environment with Docker.

I'm a enthusiast about simplifying development environments and I had the need to implement this docker environment in a Rails 5 projects sooooo le'ts get started.

### Building the Dockerfile

I tried to build a Dockerfile for the Rails container using [Alpine Linux](https://alpinelinux.org/) but things got complicated and a gave up for now, I still want to build a Rails container on top of Alpine.

In this setup we'll use [PostgreSQL](https://www.postgresql.org/) as database and [Yarn](https://yarnpkg.com) to manage our front-end dependencies.

For now we'll use `ruby-2.2.2` image for the Rails container:

```yaml
# Dockerfile
FROM ruby:2.2.2

# libpq-dev is needed because I'm using PostgreSQL but fell
# free to remove it if you're not
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

RUN mkdir -p /app
WORKDIR /app

# /box will be our data container to cache bundler dependencies
ENV BUNDLE_PATH /box

RUN gem install bundler && bundle config build.nokogiri --use-system-libraries

# Copy the main application.
COPY . ./

# Expose port 3000 to the Docker host, so we can access it
# from the outside.
EXPOSE 3000
```

### Building the docker-compose.yml

As described in the comments we'll use a data container to cache our bundler dependencies, for this I'm using the 5mb docker image called `busybox`.

```yaml
#docker-compose.yml
version: '2'
services:
  yarn:
    image: netczuk/node-yarn
    volumes:
      - ./package.json:/package.json
      - ./yarn.lock:/yarn.lock
      - ./node_modules:/node_modules
    command: yarn install
  db:
    image: postgres:alpine
    logging:
      driver: none
  box:
    image: busybox
    volumes:
      - /box
  web:
    build: .
    command: bash -c "rm -f tmp/pids/server.pid && bundle install && bundle exec rails s -p 3000 -b '0.0.0.0'"
    volumes:
      - .:/app
    volumes_from:
      - box
    ports:
      - "3000:3000"
    depends_on:
      - yarn
    environment:
      RAILS_ENV: development
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: ''
      POSTGRES_HOST: 'db'
```

Let's talk a little about this file.

#### Yarn

I'm using the `netczuk` image because for now we don't have an official image and this one seems to be more simple to use and fill our needs in this development environment.

#### PostgreSQL

I'm disabling the logging in Postgres container but you can enable it by removing the `logging` key.

#### Rails

Our Rails container is called `web` and it's build based on the Dockerfile we saw above in this post. You can remove the `bundle install` from the command if you like and run whenever you whish:

        docker-compose run web bundle install

The `rm -f tmp/pids/server.pid` statement fixes a bug that happens when you stop the container and Rails thinks that's still running.

Also those environment variables for Postgres are the default credentials for the database and you can change the `RAILS_ENV` for production if you like.

### Updating database.yml

Well, seeing that we're declaring some environment variables for the database credentials we need to change our database.yml to get those credentials.

You just need to change this:

```yml
# config/database.yml
development:
  <<: *default
  database: myapp_development
  username: <%= ENV['POSTGRES_USER'] %>
  password: <%= ENV['POSTGRES_PASSWORD'] %>
  host: <%= ENV['POSTGRES_HOST'] %>
```

And tadaaaa!! Just run `docker-compose up` and you'll have your rails app running on port 3000.

Let me know in the comments if you have futher questions.
