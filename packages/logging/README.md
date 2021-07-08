# @stool/logging

## Install:

```sh
npm install @stool/logging
```

### Using
```js
import { getLogger, ConsoleHandler } from '@stool/logging';

const logger = getLogger('app'); // or with root: const logger = getLogger();
logger.setLevel('DEBUG');

const consoleHandler = new ConsoleHandler();
consoleHandler.setFormater(new SimpleFormater('{name} {levelName} {msg}'));
logger.addHandler(consoleHandler);


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
