var path = require('path')
var ora = require('ora')
var chalk = require('chalk')
var FtpDeploy = require('ftp-deploy')

var localRoot = path.join(__dirname, '..', 'dist')
var remoteRelRoot = 'playcanvasplayground/demo/'
var remoteAbsRoot = `/htdocs/${remoteRelRoot}`
var host = 'hz226350.ftp.aliapp.com'
var wwwRoot = 'http://demo.ubiray.com/'
var www = `${wwwRoot}/${remoteRelRoot}`
var ftpDeploy = new FtpDeploy()


function _deploy(spinner) {

    var config = {
        host,
        localRoot,
        remoteRoot: remoteAbsRoot,
        username: "hz226350",
        password: "RayIon2016", // optional, prompted if none given
        port: 21,
        exclude: ['.git', '.idea', 'tmp/*', 'build/*', '.DS_Store']
    }

    spinner.start(`deploying: ${chalk.green(localRoot)} --> ${chalk.green(host)}: ${chalk.green(remoteAbsRoot)}`)

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
        console.log(chalk.cyan(`deploy done! you can visit it here: ${www}`))
    } catch (err) {
        spinner.fail(chalk.red(err))
    } finally {
        spinner.stop()
    }
}

main()
