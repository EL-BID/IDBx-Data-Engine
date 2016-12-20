# edX Platform Data Processing

## Basic execution
```shell
docker run --rm \
--name edx-import \
--env AWS_ACCESS_KEY_ID=… \
--env AWS_SECRET_ACCESS_KEY=… \
--env KEY_PASSPHRASE=… \
--env STORAGE_DB=edx \
--link mongodb-storage:storage \
iadb/edx-import
```

## Sync
The data synchronisation process will download the latest data packages directly from AWS, process them accordingly and load the records into the storage database.

```shell
docker run ... iadb/edx-import  sync
```

## Commands
There’re different scripts under the ‘commands’ directory, further details can be inspected in each, the easiest way to execute any is:

```shell
docker run ... iadb/edx-import cmd [NAME]
```

## Background execution
If required any command can be executed as a deattached/background process doing the following:

```shell
# Start an interactive instance as a deattached container
docker run -itd --name bg \
-v /home/core:/tmp \
--link mongodb-container:storage \
--entrypoint "/bin/bash" \
iadb/edx-import

# Start a new shell in the same container
docker exec -it bg /bin/bash

# Execute the process, send it to the background and disown
# [PROCESS HERE]...
bg && disown %1
exit
```
