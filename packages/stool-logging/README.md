# @stool/logging

## Install:

```sh
npm install @stool/logging
```

### Using
```js
import { getLogger } from '@stool/logging';

const logger = getLogger('app');

logger.fatal('...');
logger.error('...');
logger.warn('...');
logger.info('...');
logger.debug('...');
logger.exception(e);

// create app child logger
const dbLogger = getLogger('app.db');
```

## License
MIT
