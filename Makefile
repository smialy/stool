test-ci:
	make init
	make test

init:
	make bootstrap
	make build

bootstrap:
	npm install --no-package-lock
	make clean
	./node_modules/.bin/lerna bootstrap -- --no-package-lock

build:
	./node_modules/.bin/lerna run build

clean:
	./node_modules/.bin/lerna clean --yes

test:
	./node_modules/.bin/lerna run test

karma:
	./node_modules/.bin/lerna run karma --concurrency 1

lint:
	./node_modules/.bin/lerna run lint
