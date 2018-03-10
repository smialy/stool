# sjs-logging

## Getting Started

#### 1. Install:

```sh
$ npm install sjs-logging
```

#### 2.1 Using
```js
import logging from 'sjs-logging';
//...
var logger = logging.getLogger();

logger.fatal('...');
logger.error('...');
logger.warn('...');
logger.info('...');
logger.debug('...');
logger.exception(e);

```

## License
MIT
