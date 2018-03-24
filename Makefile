test-ci:
	make bootstrap
	make test

bootstrap:
	npm install --no-package-lock
	make clean
	./node_modules/.bin/lerna bootstrap -- --no-package-lock

clean:
	./node_modules/.bin/lerna clean --yes

test:
	./node_modules/.bin/lerna run test
