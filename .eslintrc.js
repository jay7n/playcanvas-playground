module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 7,
    },
    env: {
        es6: true,
        browser: true,
    },
    extends: "eslint:recommended",

    // global vars
    'globals': {
        "BUILD": true,
        'require':true,
        'Promise':true,
        '__dirname':true,
        'module': true,
        'exports': true,
        'process': true,
    },

    // our custom rules here
    rules: {
        "indent": [
            "error",
            4
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-unused-vars": 1,
        "no-redeclare": 1,
        "no-console": 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    },
}
