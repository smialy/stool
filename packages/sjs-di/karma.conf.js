// Karma configuration

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['qunit'],
        files: [
            "tests/*.js",
            'src/*.js'
        ],
        preprocessors: {
            'tests/*.js': ['rollup'],
            'src/*.js': ['rollup']
        },
        rollupPreprocessor: {
            format: 'iife',
            moduleName: 'events',
            sourceMap: 'inline'
        },
        reporters: ['progress'],
        // web server port
        port: 9876,
        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome', 'Firefox']
    });
};
