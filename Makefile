test-ci:
	npm install --no-save lerna@3.4.2 qunit@2.7.1 @babel/register@7.0.0 \
		@babel/core@7.1.2 @babel/plugin-transform-modules-commonjs@^7.1.0 \
		ts-node@7.0.1 typescript@3.1.6 tslint@5.11.0 eslint@5.0.0
	./node_modules/.bin/lerna run test
	./node_modules/.bin/lerna run lint

bootstrap:
	npm install --no-package-lock
	./node_modules/.bin/lerna bootstrap

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
