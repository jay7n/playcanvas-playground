import pc from 'play-canvas'
import _ from 'lodash'

import { underPath } from '@/utils/methods'

// import { defineMyScript } from './interact'
import { DefineOrbitCameScripts }  from './script.interact'
import { loadMaterialFromUrl } from './loader'

window.pc = pc

export class Stupid3DAppClass {

    constructor(canvas) {
        this.canvas = canvas

        this.app = null
        this.camera = null
        this.light = null
        this.entity = null
    }

    // internal methods
    //
    _initApp() {
        const app = new pc.Application(this.canvas, {
            mouse: new pc.Mouse(this.canvas),
        })

        // fill the available space at full resolution
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW)
        app.setCanvasResolution(pc.RESOLUTION_AUTO)

        // ensure canvas is resized when window changes size
        window.addEventListener('resize', function() {
            app.resizeCanvas()
        })


        app.start()
        this.app = app
    }

    _initScripts() {
        DefineOrbitCameScripts('my-orbit-camera-script')
    }

    _initCamera() {
        const camera = new pc.Entity('camera')
        camera.addComponent('camera', {
            clearColor: new pc.Color(0, 0, 0)
        })
        camera.setPosition(0, 0, 3)
        camera.lookAt(0,0,0)

        camera.addComponent('script')
        camera.script.create('my-orbit-camera-script')

        this.app.root.addChild(camera) // camera needs to be added first, cuz scripts attached in entity will use it when get initialized
        this.camera = camera
    }

    _initLight() {
        const light = new pc.Entity('light')
        light.addComponent('light', {
            color: new pc.Color(1,1,1),
            range: 30,
        })
        light.setPosition(3, 1, 5)

        this.app.root.addChild(light)
        this.light = light

        this.app.scene.ambientLight = new pc.Color(0.5,0.5,0.5)
    }


    _initEntity(type='box', asset) {
        let entity = this.entity

        if (entity) {
            entity.removeComponent('model')
        } else {
            entity = new pc.Entity('myentity')
            this.app.root.addChild(entity)

            this.entity = entity
        }

        const modelOptions = { type }
        if (type == 'asset') {
            Object.assign(modelOptions, { asset })
        }

        entity.addComponent('model', modelOptions)
        entity.setPosition(0,0,0)

    }

    // # public methods
    //
    init() {
        this._initApp()
        this._initScripts()
        this._initCamera()
        this._initLight()
        this._initEntity()
    }

    updateModelFromURL(modelURL) {
        console.log(modelURL)
        return new Promise((resolve, reject) => {
            if (!_.isString(modelURL)) reject('no valid URL provided')

            this.app.assets.loadFromUrl(modelURL, 'model', (err, asset) => {
                if (err) reject(err)
                else {
                    this._initEntity('asset', asset)
                    resolve()
                }
            })
        })
    }
}


async function _create_entity(app) {
    return new Promise((resolve, reject) => {
        app.assets.loadFromUrl(underPath.assets('3d-models/my_sofa/georgetti_51960.json'), "model", function (err, asset) {
            if (err) {
                reject(err)
            } else {
                resolve(asset)
            }
        })
    }).then((asset) => {
        return loadMaterialFromUrl(app, underPath.assets('3d-models/ball/9016131/ball.json'))
            .then((material) => {
                console.log(material)
                return {material, asset}
            })
    }).then(({material, asset}) => {
        const entity = new pc.Entity('my_sofa')
        entity.addComponent('model', {
            type: 'asset',
            asset,
        })

        // material.update()

        const mis = entity.model.meshInstances
        for (const mi of mis) {
            mi.material = material
        }

        entity.addComponent('script')
        entity.script.create('my')

        return entity
    })
}

async function setup() {
    // create a PlayCanvas application
    const canvas = document.getElementById('canvas')
    var app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
    })

    // create camera entity
    var camera = new pc.Entity('camera')
    camera.addComponent('camera', {
        clearColor: new pc.Color(0, 0, 0)
    })
    camera.setPosition(0, 0, 3)

    // define scripts after app created by pc
    // defineMyScript()

    app.start()

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW)
    app.setCanvasResolution(pc.RESOLUTION_AUTO)

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', function() {
        app.resizeCanvas()
    })

    // create customize entity
    const entity = await _create_entity(app)
    // entity.rotateLocal(0, 90, 0);
    // entity.rotate(0, 90, 0)
    // entity.rotate(90,0,0)
    entity.setPosition(0,0,0)


    // create directional light entity
    var light = new pc.Entity('light')
    light.addComponent('light', {
        type: 'point',
        color: new pc.Color(1,1,1),
        range: 10,
    })
    light.setPosition(0, 0, 5)

    // set up initial positions and orientations
    // light.setEulerAngles(45, 0, 0)

    // add to hierarchy
    app.root.addChild(camera) // camera needs to be added first, cuz scripts attached in entity will use it when get initialized
    app.root.addChild(light)
    app.root.addChild(entity)

    // register a global update event
    app.on('update', function (deltaTime) {
        // entity.rotateLocal(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);
    })
}

// const  M = {
//     setup
// }
//
