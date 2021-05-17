# Squid for Data Portal

## Overview

## Docker for local environment

Docker is amazing. [Learn it here](https://docs.docker.com/reference/).

### Tools
Some tools are needed locally for development purposes and aren't included in the containers. These are general tools that are assumed to be installed and working correctly:

* [npm](https://www.npmjs.com/get-npm) - To install packages, npm is included with [NodeJS](https://nodejs.org/), I would just install NodeJS

### How to reset Docker
If for any reason you want to clear everything and restart from scratch
`docker system prune -a`

### Build and run

Run `docker-compose up`

You should now have a complete environment up and running. Type

    docker ps -a

Now the last step to access all the virtual hosts locally, is to update your `/etc/hosts` file with the following DNS entries:

    127.0.0.1 squid.du

That should be it for Docker. 
