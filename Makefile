test-ci:
	npm install --no-save babel-register babel-plugin-transform-es2015-modules-commonjs qunit
	./node_modules/.bin/qunit --require babel-register packages/**/tests

bootstrap:
	yarn --no-lockfile
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
