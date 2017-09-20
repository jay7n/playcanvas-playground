var ora = require('ora')
var webpack = require('webpack')
var path = require('path')
var chalk = require('chalk')

var Conf = require('../config/conf')

var webpackConfig = require('../config/webpack/prod.conf')

var spinner = ora('building for production...')

function _build_prod(spinner) {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, function(err, stats) {
            if (err) reject(err)

            console.log(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }, '\n'))

            resolve()
        })
    })
}

async function main() {
    try {
        console.log(chalk.green('build production...'))
        await _build_prod()
        console.log(chalk.green('build production done.'))
    } catch(err) {
        console.log(chalk.red(err))
    }
}

if (require.main === module) {
    main()
} else {
    module.exports = main
}
