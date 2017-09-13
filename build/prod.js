var ora = require('ora')
var webpack = require('webpack')
var path = require('path')
var chalk = require('chalk')

var Conf = require('../config/conf')

var webpackConfig = require('../config/webpack/prod.conf')

var spinner = ora('building for production...')

async function main() {
    spinner.start()
    await new Promise((resolve) => {
        webpack(webpackConfig, function(err, stats) {
            spinner.stop()

            if (err) throw err

            console.log(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }, '\n'))

            console.log(chalk.cyan('  Build complete.\n'))
            resolve()
        })
    })
}

if (require.main === module) {
    main()
} else {
    module.exports = main
}
