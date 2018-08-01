test-ci:
	npm install --no-save qunit@2.6.1 babel-register@6.26.0 babel-plugin-transform-es2015-modules-commonjs@6.26.2
	./node_modules/.bin/qunit --require babel-register packages/**/tests/

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
