const path = require('path')
const fse = require('fs-extra')
const chalk = require('chalk')
const ora = require('ora')
const {exec} = require('child_process')
const request = require('request')
const unzip = require('unzip')


const myconf = require('../config/conf')

// const repo_uri = 'https://github.com/playcanvas/engine/archive/master.zip'
const repo_uri = 'https://codeload.github.com/playcanvas/engine/zip/stable'
const local_path = path.resolve(myconf.RootPath, 'third', 'play-canvas')
const repo_name = 'engine-stable' // this name is given by github
const builtout_pc_name = 'index.js'

let msg_prefix = ''
let from_api_call = false

function _l(spinner, msg, stat) {
    msg = msg_prefix + msg

    if (from_api_call) {
        if (stat == 'success') {
            console.log(chalk.cyan(msg))
        } else if (stat == 'error') {
            console.error(chalk.red(msg))
        } else if (stat == 'update') {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
            process.stdout.write(chalk.green(msg))
        } else if (stat == 'warn') {
            console.log(chalk.yellow(msg))
        } else {
            console.log(chalk.green(msg))
        }
    } else {
        if (stat == 'success') {
            spinner.succeed()
        } else if (stat == 'error') {
            spinner.fail(chalk.red(msg))
        } else if (stat == 'update') {
            spinner.text = chalk.green(msg)
        } else if (stat == 'warn') {
            spinner.stopAndPersist(chalk.yellow(msg))
        } else {
            spinner.start(chalk.green(msg))
        }
    }
}

function _download_unzip(spinner, uri, local_path) {
    const zip_path = path.resolve(local_path,'play-canvas.zip')
    const msg = 'downloading PlayCanvas repo ...'

    return new Promise((resolve, reject) => {
        if (!fse.pathExistsSync(zip_path)) {
            fse.ensureDirSync(local_path)

            _l(spinner, msg)
            let total = 0 // by byte
            let downloaded = 0 // by byte

            const req = request(uri)

            req.pipe(fse.createWriteStream(zip_path))
                .on('close', () => {
                    _l(spinner, null, 'success')
                    resolve()
                })

            req.on('response', ( data ) => {
                total = data.headers[ 'content-length' ]
            })

            const legacy_spinner_msg = msg
            req.on('data', (chunk) => {
                downloaded += chunk.length
                if (total) {
                    // .000000954 = 1/1024/1024
                    const progress_msg = `: ( ${(downloaded*.000000954).toFixed(2)}MB/${(total*.000000954).toFixed(2)}MB = ${(downloaded / total * 100).toFixed(0)}% )`
                    _l(spinner, legacy_spinner_msg + progress_msg, 'update')
                }
            })

            req.on('error', (err) => {
                if (downloaded < total) {
                    _l(spinner, 'downloading interuppted. delete zip package for \n\t' + zip_path, 'warn')
                    fse.removeSync(zip_path)
                }

                reject(err)
            })
        } else {
            resolve()
        }
    }).then(() => {
        return new Promise((resolve,reject) => {
            _l(spinner, 'unzipping play-canvas zip package ...')

            fse.createReadStream(zip_path).pipe(unzip.Extract({
                path: path.resolve(local_path)
            }))
                .on('close', () => {
                    _l(spinner, null, 'success')
                    resolve()
                })
                .on('error', (err) => {
                    reject(err)
                })
        })
    })
}

function download_pc_repo(spinner) {
    return _download_unzip(spinner, repo_uri, local_path)
}

function build_engine(spinner) {
    return new Promise((resolve, reject) => {
        _l(spinner, 'building PlayCanvas engine ...')

        const previous_cwd = process.cwd()
        const build_script_path = path.resolve(local_path, repo_name, 'build')
        process.chdir(build_script_path)

        const cmd = `node build.js -o '../../${builtout_pc_name}'`

        exec(cmd, (err, stdout, stderr) => {
            if (stdout) { _l(spinner, stdout) }
            process.chdir(previous_cwd)

            if (err) {
                reject(err)
            } else {
                _l(spinner, 'PlayCanvas engine built', 'success')
                resolve(path.resolve(local_path, builtout_pc_name))
            }
        })
    })
}

function inject_exports_engine(spinner, engine_file_path) {
    return new Promise((resolve, reject) => {
        _l(spinner, 'injecting \'modle.exports=pc\' for PlayCanvas engine ...')

        fse.appendFile(engine_file_path, '\n\nmodule.exports = pc\n', 'utf8', (err) => {
            if (err) {
                reject(err)
            } else {
                _l(spinner, 'PlayCanvas engine injected.', 'success')
                resolve()
            }
        })
    })
}

async function main(args) {
    const spinner = ora()

    try {
        msg_prefix = args[0] || ''
        from_api_call = args[1] || false

        await download_pc_repo(spinner)
        const engine_file_path = await build_engine(spinner)
        await inject_exports_engine(spinner, engine_file_path)
    } catch(err) {
        _l(spinner, err, 'error')
    } finally {
        spinner.stop()
    }
}

if (require.main === module) {
    const args = process.argv.slice(2)
    main(args)
} else {
    module.exports = main
}
