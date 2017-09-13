const path = require('path')
const fse = require('fs-extra')
const chalk = require('chalk')
const ora = require('ora')
const {exec} = require('child_process')

const myconf = require('../config/conf')

const l = console.log

function _do_with_report(s, func, desc) {
    s.start(chalk.green(desc))
    return func(s).then(() => {
        s.succeed()
    })
}

function _exec_cmd(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) { reject(err) }
            else if (stderr) {reject(stderr)}

            resolve()
        })
    })
}

function clean_up(s) {
    return new Promise((resolve) => {
        ['node_modules', 'third'].map( d => {
            if (d == 'node_modules') return
            const p = path.resolve(myconf.RootPath, d)
            fse.removeSync(p)
        })
        resolve()
    })
}

async function build_play_canvas_engine(s) {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500)
    }).then(() => {
        s.stopAndPersist()
        const script = require('./build-play-canvas.js')
        return script(['\t'])
    })
}


async function build_prod(s) {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500)
    }).then(() => {
        s.stopAndPersist()
        const script = require('./prod.js')
        return script(['\t'])
    })
}

async function main() {
    // into the proejct folder before get start
    const previous_cwd = process.cwd()
    process.chdir(myconf.RootPath)

    const s = ora()
    try {
        await _do_with_report(s, clean_up, '(1/3). clean up all relative libs... ')
        await _do_with_report(s, build_play_canvas_engine, '(2/3). build playcanvas engine to the third ... ')
        await _do_with_report(s, build_prod, '(3/3). build app production for first time ... ')
        l('\n')
        s.succeed(chalk.green('done.now you\'re all set !'))
    } catch(err) {
        s.fail(chalk.red(err))
    } finally {
        s.stop()
    }

    process.chdir(previous_cwd)
}

main()
