test-ci:
	make test-ci-install
	make test-ci-run

test-ci-install:
	npm install --no-save lerna@3.20.2 microbundle@0.12.0-next.7 qunit@2.9.3 ts-node@8.6.2 typescript@3.7.5 tslint@6.0.0 eslint@5.0.0 @types/qunit@2.9.0

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
