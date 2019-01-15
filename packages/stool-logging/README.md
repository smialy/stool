# @stool/logging

## Install:

```sh
npm install @stool/logging
```

### Using
```js
import logging from '@stool/logging';

const logger = logging.getLogger('app');

logger.fatal('...');
logger.error('...');
logger.warn('...');
logger.info('...');
logger.debug('...');
logger.exception(e);

// create app child logger
const dbLogger = logging.getLogger('app.db');
```

## License
MIT
