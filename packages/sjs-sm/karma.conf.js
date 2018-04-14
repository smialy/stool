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
            output: {
                format: 'iife',
                name: 'di',
                sourcemap: 'inline'
            }
        },
        reporters: ['progress'],
        // web server port
        port: 9876,
        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,
        autoWatch: true,
        browsers: ['Chrome', 'Firefox']
    });
};