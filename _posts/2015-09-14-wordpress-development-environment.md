---
title:  Wordpress Development Environment with Docker
date:   2015-09-14 19:00:00
description: How to get a WordPress installation in seconds
tags: [php, wordpress, development, environment, docker]
category: [php, wordpress, docker, setup]
banner_image: docker.png
image: docker_logo.png
---

WordPress is an awesome CMS but setup a WordPress development environment could be a bit painful.

First of all you need a *LAMP* stack or something similar. Then you need to download a copy of WordPress, copy your theme (or plugin) and finally install WordPress.

Well, fortunately we are in 2015 and someone has invented something to make our life easier<!--more-->:

[Docker](http://docker.io) is a platform that allows the creation of containers to setup development and production environments. So we can turn all that painfull process into a piece of cake.

Let’s do it.

First of all you need to install [Docker Toolbox](https://www.docker.com/toolbox). Docker Toolbok installs all dependencies to use Docker. If are you using Linux, you can install manually.

Create a new docker machine and load his env variables:

	docker-machine create --driver virtualbox default
	eval "$(docker-machine env default)"

Create a file named `docker-compose.yml` in your theme’s root:

```yaml
wordpress:
  image: wordpress
  links:
    - database:mysql
  ports:
    - 8080:80
  working_dir: /var/www/html
  volumes:
   - .:/var/www/html/wp-content/themes/my-theme/

database:
  image: mariadb
  environment:
    MYSQL_ROOT_PASSWORD: somepassword
```

This file tells to Docker run two containers: *wordpress* using the `wordpress` image and *database* using the `mariadb` image.

If are you developing a plugin, just need to change the path of the `volumes` option.

With the `docker-compose.yml` file created we are ready to go! Just run:

	docker-compose up

Wait it finishes and open `http://localhost:8080`.

If you're in OSX, will need to access the VM directly. Get the machine IP running:

	docker-machine ip default

Open `http://<machine-ip>:8080` and you will see the WordPress installation page.

Proceed with WordPress installation, login and activate your theme.

Done! :)
