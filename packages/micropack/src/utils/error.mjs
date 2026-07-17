function logError(error) {
    const detail = error?.stack ?? error;
    console.log(`\n${detail}\n\nNode.js ${process.version}\n`);
}

export function setupExceptionHandler() {
    process.on('uncaughtException', logError);
    process.on('unhandledRejection', logError); // catch all promises
}
