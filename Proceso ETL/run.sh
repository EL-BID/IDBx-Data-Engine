#!/bin/sh

# Check storage is properly setup
if [ -z ${STORAGE_PORT_27017_TCP_ADDR} ] || [ -z ${STORAGE_PORT_27017_TCP_PORT} ]; then
  echo "[ERROR] No storage element available"
  exit 1
fi

# Process course data
process_courses() {
  # Download and extract data
  mkdir courses
  aws s3 cp s3://course-data/idbx-`date +%Y-%m-%d -d "yesterday"`.zip courses/.
  unzip courses/idbx-`date +%Y-%m-%d -d "yesterday"`.zip -d courses/.
  rm courses/idbx-`date +%Y-%m-%d -d "yesterday"`.zip
  mv courses/idbx-`date +%Y-%m-%d -d "yesterday"`/* courses/.
  rmdir courses/idbx-`date +%Y-%m-%d -d "yesterday"`

  # Decrypt
  echo ${KEY_PASSPHRASE} | gpg --passphrase-fd 0 --decrypt-files --no-tty courses/*.gpg
  rm courses/*.gpg

  # Import
  edx-import courses -s ${STORAGE_PORT#tcp://} -d ${STORAGE_DB} -D /root/

  # Cleanup
  rm -rf courses
}

# Process events
process_events() {
  mkdir events
  aws s3 cp s3://edx-course-data/idbx/edx/events/`date +%Y`/idbx-edx-events-`date +%Y-%m-%d -d "yesterday"`.log.gz.gpg events/.

  # Decrypt and decompress
  echo ${KEY_PASSPHRASE} | gpg --passphrase-fd 0 --decrypt-files --no-tty events/*.gpg
  gzip -d events/*.gz
  rm events/*.gz.gpg

  # Import
  edx-import events -s ${STORAGE_PORT#tcp://} -d ${STORAGE_DB} -D /root/

  # Cleanup
  rm -rf events
}

# Main execution point
FUNC=${1:-sync}
case ${FUNC} in
  "sync")
    # Import key and move to home dir
    gpg --import /edx-import/key.asc
    cd /root

    # Each sunday, process courses data
    DOW=`date +"%A" | tr -d '[[:space:]]'`
    if [ "$DOW" = "Monday" ]; then
      process_courses
      cd /edx-import
      edx-import update-reports -s ${STORAGE_PORT#tcp://} -d ${STORAGE_DB}
    fi
    process_events
  ;;
  "cmd")
    mongo ${STORAGE_PORT_27017_TCP_ADDR}:${STORAGE_PORT_27017_TCP_PORT}/edx --quiet commands/${2}.js
  ;;
  *)
    echo "[ERROR] Invalid function name"
    exit 1
  ;;
esac
