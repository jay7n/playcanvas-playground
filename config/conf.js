var path = require('path')

module.exports = {
    RootPath: path.resolve(__dirname, '..'),

    Dev: {
        Host: '127.0.0.1',
        Port:8086
    },

    AutoOpenBrowser: true,

    HMR: false
}
