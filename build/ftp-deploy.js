var path = require('path')
var ora = require('ora')
var chalk = require('chalk')
var FtpDeploy = require('ftp-deploy')

function _deploy(spinner) {
    var localRoot = path.join(__dirname, '..', 'dist')
    var remoteRoot = '/htdocs/playcanvas_demo/'
    var host = 'hz226350.ftp.aliapp.com'
    var ftpDeploy = new FtpDeploy()

    var config = {
        host,
        localRoot,
        remoteRoot,
        username: "hz226350",
        password: "RayIon2016", // optional, prompted if none given
        port: 21,
        exclude: ['.git', '.idea', 'tmp/*', 'build/*', '.DS_Store']
    }

    spinner.start(`deploying: ${chalk.green(localRoot)} --> ${chalk.green(host)}: ${chalk.green(remoteRoot)}`)

    return new Promise((resolve, reject) => {
        ftpDeploy.deploy(config, function(err) {
            if (err)  reject(err)
            else resolve()
        })
    })
}

async function main() {
    var spinner = ora()
    try {
        await _deploy(spinner)
        spinner.succeed()
    } catch (err) {
        spinner.fail(chalk.red(err))
    } finally {
        spinner.stop()
    }
}

main()
