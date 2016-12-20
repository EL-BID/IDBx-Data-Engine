default: build

build:
	docker build -t iadb/edx-import .

run:
  docker run \
  --env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  --env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  --env KEY_PASSPHRASE=${KEY_PASSPHRASE} \
  --env STORAGE_DB=edx \
  --link ${STORAGE_ID}:storage \
  iadb/edx-import
