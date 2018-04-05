test-ci:
	make bootstrap
	make build
	make test

build:
	./node_modules/.bin/lerna run build

bootstrap:
	npm install --no-package-lock
	make clean
	./node_modules/.bin/lerna bootstrap -- --no-package-lock

clean:
	./node_modules/.bin/lerna clean --yes

test:
	./node_modules/.bin/lerna run test

lint:
	./node_modules/.bin/lerna run lint
