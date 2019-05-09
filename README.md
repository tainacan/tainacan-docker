# Tainacan Docker

This repository offers Docker files and scripts to build Tainacan environments using Docker.

Currently we have a mature image for development but we are working on a version for production.

Below you will find instructions on how to use this repository for each case.

**In any case, start by cloning this repository.**

## Building a development environment

Inside this repository there is a folder called `dev`, where all the files related to the docker development environment are. Enter this folder:

```
cd dev
```

In this folder there is a script called `tainacan.sh`. This script will help you through the process of setting up the docker environment and to use it as you develop.

Overview:

```
./tainacan.sh --help

            --build-image =  build docker images for application and database (super user).
            --build-image-elastic =  build docker images for application, database and elasticsearch server (super user).
            --start       =  start the containers (super user).
            --start-elastic = start the containers and the elastic search server (super user)
            --stop        =  stops all containers(super user).
            --clone       =  clones tainacan and tainacan-interface repositories into the dev folder
            --ssh-clone   =  clones tainacan and tainacan-interface repositories into the dev folder using your ssh keys
            --run-tests   =  run phpunit tests (super user).
            --bash        =  enters the container
            --bash-mysql  =  enters the mysql container
	    --build       =  builds tainacan plugin and theme (super user).
            --watch-build =  watches for changes in the plugin and theme and builds them (super user).
            --help        =  displays this help message

```

### Setting up

To set up your environment the first time, you need to run this commands, in this order:

```
./tainacan.sh --clone
./tainacan.sh --build-image
```

(alternatively use `--build-image-elastic` if you want to have elastic search)

Once you have done that, you have cloned the code repositories (for both plugin and default theme) and built the docker images (this can take a while).

### Using the environment

Every time you want to launch your development environment, simply run:

```
./tainacan.sh --start
```

(alternatively use `--start-elastic` if you want to have elastic search)

Now everytime you make a change to the code, you need to build the plugin by running:

```
./tainacan.sh --build
```

Or launch the watcher and let it build automatically everytime you change a file:

```
./tainacan.sh --watch-build
```

Finally, always run the tests:

```
./tainacan.sh --run-tests
```

### Final remarks

The `wp-content` folder will have all your plugins and themes. So if you want to have addtional plugins or themes, simply add them there.

The repositories are cloned inside the `repo` folder. After making changes to the code, enter those directories to commit.
