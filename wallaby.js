module.exports = wallaby => {
    const path = require('path');

    process.env.NODE_PATH +=
        path.delimiter +
        path.join(__dirname, 'node_modules') +
        path.delimiter +
        path.join(
            __dirname,
            'node_modules/react-scripts/node_modules'
        );
    require('module').Module._initPaths();

    return {
        files: [
            'app/**/*.+(js|jsx|json|snap|scss|jpg|jpeg|gif|png|svg)',
            'test/mocks/**/*.js',
            '!test/**/*.test.js?(x)',
        ],
        tests: ['test/**/*.test.js?(x)'],
        env: { type: 'node', runner: 'node' },

        compilers: {
            '**/*.js?(x)': wallaby.compilers.babel({
                babel: require('babel-core'),
                presets: ['react-app'],
            }),
        },
        setup: wallabyTest => {
            const jestConfig = require('react-scripts/scripts/utils/createJestConfig')(
                p => require.resolve(`react-scripts/${p}`)
            );
            Object.keys(jestConfig.transform || {}).forEach(
                k =>
                    ~k.indexOf('^.+\\.(js|jsx') &&
                    void delete jestConfig.transform[k]
            );
            delete jestConfig.testEnvironment;
            wallabyTest.testFramework.configure(jestConfig);
        },
        testFramework: 'jest',debug:1
    };
};