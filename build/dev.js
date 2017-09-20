const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const opn = require('opn')

const Conf = require('../config/conf')
let devWebpackConfig = require(path.resolve(Conf.RootPath, 'config', 'webpack', 'dev.conf'))

function _log_start_listen() {
    const host = Conf.Dev.Host
    const port = Conf.Dev.Port

    const uri = `http://${host}:${port}`

    const _report = () => {
        console.log(chalk.green('> app listening at ' + uri + '  ... ͼ\n'))
    }

    return {host, port, uri, _report}
}

function main() {
    // using Hot Module Replacement ?
    if (Conf.HMR) {
        const express = require('express')
        const webpackDevMiddleware = require('webpack-dev-middleware')
        const webpackHotMiddleware = require('webpack-hot-middleware')

        Object.keys(devWebpackConfig.entry).forEach(function (name) {
            devWebpackConfig.entry[name] = ['webpack-hot-middleware/client'].concat(devWebpackConfig.entry[name])
        })
        const compiler = webpack(devWebpackConfig)

        const devMiddleware = webpackDevMiddleware(compiler, {
            publicPath: devWebpackConfig.output.publicPath,
            inline: true,
        })

        const hotMiddleware = webpackHotMiddleware(compiler, {
            log: () => {}
        })

        // force page reload when html-webpack-plugin template changes
        compiler.plugin('compilation', function (compilation) {
            compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
                hotMiddleware.publish({ action: 'reload' })
                cb()
            })
        })

        const app = express()
        app.use(devMiddleware)
        app.use('/assets', express.static(path.resolve(Conf.RootPath, 'assets')))
        app.use(hotMiddleware)

        const { host, port, uri, _report } = _log_start_listen()
        const server = app.listen(port, host)

        devMiddleware.waitUntilValid(() => {
            _report()

            if (Conf.AutoOpenBrowser) {
                opn(uri)
            }
        })
    } else {
        const devWebpackConfigPath = path.resolve(Conf.RootPath, 'config', 'webpack', 'dev.conf.js')
        const { host, port, _report } = _log_start_listen()

        let options = [
            `--config ${devWebpackConfigPath}`,
            `--host ${host}`,
            `--port ${port}`,
            '--inline',
            '--hot',
        ]

        if (Conf.AutoOpenBrowser) {
            options.push('--open')
        }

        options = options.join(' ')

        const devServerBin = path.resolve(Conf.RootPath, 'node_modules', 'webpack-dev-server','bin', 'webpack-dev-server.js')
        let cmd = `node ${devServerBin} ${options}`

        // console.log(chalk.green(`now ready to exec cmd:\n\t${cmd}\n`))

        const { exec } = require('child_process')

        const p = exec(cmd)
        p.stdout.on('data', (data) => console.log(chalk.green(data)))
        p.stderr.on('data', (data) => console.log(chalk.yellow(data)))
    }
}


if (require.main === module) {
    main()
} else {
    module.exports = main
}
