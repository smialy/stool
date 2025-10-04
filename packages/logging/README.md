# @stool/logging

A simple, logging library inspired by Python's logging module. 
Features include multiple log levels, custom formatters, filters, and handlers.

## Features

- 🏗️ Hierarchical logger structure with parent-child relationships
- 📊 Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL/CRITICAL)
- 🎨 Customizable formatters for log output
- 🔍 Filtering capabilities for fine-grained log control
- 📤 Multiple handlers (Console, and extensible for custom handlers)
- 🌐 Global logger factory for consistent logging across your application

## Install

```sh
npm install @stool/logging
```

## Quick Start

```typescript
import { getLogger, ConsoleHandler, SimpleFormater } from '@stool/logging';

// Get a logger instance
const logger = getLogger('app');
logger.setLevel('DEBUG');

// Add a console handler with custom formatting
const consoleHandler = new ConsoleHandler();
consoleHandler.setFormater(new SimpleFormater('{name} {levelName} {msg}'));
logger.addHandler(consoleHandler);

// Start logging
logger.info('Application started');
logger.error('Something went wrong');
```

## Basic Usage

### Creating Loggers

```typescript
import { getLogger } from '@stool/logging';

// Root logger
const rootLogger = getLogger();

// Named logger
const appLogger = getLogger('app');

// Child logger (inherits from parent)
const dbLogger = getLogger('app.database');
const userLogger = getLogger('app.user');
```

### Log Levels

```typescript
const logger = getLogger('myapp');

// Set minimum log level
logger.setLevel('INFO'); // or use Levels.INFO

// Logging methods (in order of severity)
logger.debug('Debug information');     // Lowest priority
logger.info('General information');
logger.warn('Warning message');        // or logger.warning()
logger.error('Error occurred');
logger.fatal('Critical error');        // or logger.critical()

// Exception logging
try {
    throw new Error('Something failed');
} catch (error) {
    logger.exception(error); // Logs error with stack trace
}
```

### Advanced Logging with Extra Data

```typescript
const logger = getLogger('app');

// Log with extra context data
logger.info('User login', { userId: 123, ip: '192.168.1.1' });
logger.error('Database error', new Error('Connection failed'), { 
    query: 'SELECT * FROM users',
    duration: 1500 
});
```

## Handlers

Handlers determine where log messages are sent. You can add multiple handlers to a logger.

### Console Handler

```typescript
import { ConsoleHandler, SimpleFormater } from '@stool/logging';

const logger = getLogger('app');

// Basic console handler
const handler = new ConsoleHandler();
logger.addHandler(handler);

// Console handler with custom formatting
const customHandler = new ConsoleHandler();
customHandler.setFormater(new SimpleFormater('{levelName}: {msg}'));
customHandler.setLevel('WARN'); // Only log warnings and above
logger.addHandler(customHandler);
```

### Creating Custom Handlers

```typescript
import { BaseHandler, IRecord } from '@stool/logging';

class FileHandler extends BaseHandler {
    constructor(private filename: string) {
        super();
    }

    emit(record: IRecord): void {
        const message = this.formater.format(record);
        // Write to file (implement your file writing logic)
        console.log(`Writing to ${this.filename}: ${message}`);
    }
}

// Usage
const fileHandler = new FileHandler('app.log');
logger.addHandler(fileHandler);
```

## Formatters

Formatters control the structure and appearance of log messages.

### Built-in Formatters

```typescript
import { SimpleFormater } from '@stool/logging';

const logger = getLogger('app');
const handler = new ConsoleHandler();

// Predefined formats
handler.setFormater(new SimpleFormater(SimpleFormater.FULL));    // Full details
handler.setFormater(new SimpleFormater(SimpleFormater.BASIC));   // Basic info
handler.setFormater(new SimpleFormater(SimpleFormater.MINIMAL)); // Just message

// Custom format template
handler.setFormater(new SimpleFormater('{created} [{levelName}] {name}: {msg}'));
```

### Available Format Variables

- `{created}` - ISO timestamp
- `{timestamp}` - Unix timestamp
- `{name}` - Logger name
- `{level}` - Numeric level
- `{levelName}` - Level name (DEBUG, INFO, etc.)
- `{msg}` - Log message
- `{exception}` - Exception information
- `{extra}` - Extra context data

### Custom Formatters

```typescript
import { IFormater, IRecord } from '@stool/logging';

class JsonFormater implements IFormater {
    format(record: IRecord): string {
        return JSON.stringify({
            timestamp: record.timestamp,
            level: record.levelName,
            logger: record.name,
            message: record.msg,
            extra: record.extra
        });
    }
}

// Usage
const handler = new ConsoleHandler();
handler.setFormater(new JsonFormater());
```

## Filters

Filters provide fine-grained control over which log records are processed.

### Built-in Filter

```typescript
import { Filter } from '@stool/logging';

const logger = getLogger('app');
const handler = new ConsoleHandler();

// Only log records from 'app.database' and its children
const filter = new Filter('app.database');
handler.addFilter(filter);

logger.addHandler(handler);
```

### Custom Filters

```typescript
// Function-based filter
const errorOnlyFilter = (record) => record.level >= Levels.ERROR;
handler.addFilter(errorOnlyFilter);

// Class-based filter
class TimeFilter {
    constructor(private startHour: number, private endHour: number) {}
    
    filter(record: IRecord): boolean {
        const hour = record.created.getHours();
        return hour >= this.startHour && hour <= this.endHour;
    }
}

// Only log during business hours
handler.addFilter(new TimeFilter(9, 17));
```

## Hierarchical Logging

Loggers form a hierarchy based on their names (separated by dots). Child loggers inherit settings from parents and can propagate messages up the hierarchy.

```typescript
const appLogger = getLogger('app');
const dbLogger = getLogger('app.database');
const userDbLogger = getLogger('app.database.users');

// Add handler to parent
const handler = new ConsoleHandler();
appLogger.addHandler(handler);

// Child loggers will use parent's handler
dbLogger.info('Database connected');     // Will use app's handler
userDbLogger.info('User table ready');   // Will also use app's handler

// Add specific handler to child
const dbHandler = new ConsoleHandler();
dbHandler.setFormater(new SimpleFormater('DB: {msg}'));
dbLogger.addHandler(dbHandler);

// Now dbLogger will use both handlers
dbLogger.info('Query executed'); // Appears in both formats
```

## Complete Example

```typescript
import { 
    getLogger, 
    ConsoleHandler, 
    SimpleFormater, 
    Filter,
    Levels 
} from '@stool/logging';

// Create main application logger
const appLogger = getLogger('myapp');
appLogger.setLevel(Levels.DEBUG);

// Set up console handler with custom formatting
const consoleHandler = new ConsoleHandler();
consoleHandler.setFormater(new SimpleFormater(
    '{created} [{levelName}] {name}: {msg} {extra}'
));
appLogger.addHandler(consoleHandler);

// Create specialized loggers
const httpLogger = getLogger('myapp.http');
const dbLogger = getLogger('myapp.database');

// Add filter to only show errors for database
const dbHandler = new ConsoleHandler();
dbHandler.setLevel(Levels.ERROR);
dbHandler.setFormater(new SimpleFormater('DB ERROR: {msg}'));
dbLogger.addHandler(dbHandler);

// Usage
appLogger.info('Application starting');
httpLogger.info('Server listening on port 3000');
dbLogger.info('Database connected'); // Won't show (below ERROR level)
dbLogger.error('Query failed', { query: 'SELECT * FROM users' });

// Exception handling
try {
    throw new Error('Something went wrong');
} catch (error) {
    appLogger.exception(error);
}
```

## API Reference

### Logger Methods

- `setLevel(level: LevelType)` - Set minimum log level
- `addHandler(handler: IHandler)` - Add output handler
- `removeHandler(handler: IHandler)` - Remove handler
- `debug(msg: string)` - Log debug message
- `info(msg: string, extra?: any)` - Log info message
- `warn(msg: string, exception?: any, extra?: any)` - Log warning
- `error(msg: string, exception?: any, extra?: any)` - Log error
- `fatal(msg: string, exception?: any, extra?: any)` - Log fatal error
- `exception(error: Error)` - Log exception with stack trace

### Log Levels

```typescript
import { Levels } from '@stool/logging';

Levels.DEBUG    // 1
Levels.INFO     // 2  
Levels.WARN     // 4
Levels.ERROR    // 8
Levels.FATAL    // 16
Levels.NOTSET   // 0
```

## License

MIT
