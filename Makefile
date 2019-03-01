test-ci:
	make test-ci-install
	make test-ci-run

test-ci-install:
	npm install --no-save lerna@3.4.2 qunit@2.7.1 ts-node@7.0.1 typescript@3.1.6 tslint@5.11.0 eslint@5.0.0 @types/qunit@2.5.4

test-ci-run:
	./node_modules/.bin/lerna run test
	./node_modules/.bin/lerna run lint


bootstrap:
	npm install --no-package-lock
	./node_modules/.bin/lerna bootstrap

build:
	./node_modules/.bin/lerna run build

clean:
	./node_modules/.bin/lerna clean --yes
	./node_modules/.bin/lerna exec -- rm -rf dist

test:
	./node_modules/.bin/lerna run test

karma:
	./node_modules/.bin/lerna run karma --concurrency 1

lint:
	./node_modules/.bin/lerna run lint
