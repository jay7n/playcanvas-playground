import pc from 'play-canvas'

import { underPath } from '@/utils/methods'

import { defineMyScript } from './interact'
import { loadMaterialFromUrl } from './loader'


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
    const tagCanvas = document.getElementById('canvas')
    var app = new pc.Application(tagCanvas, {
        mouse: new pc.Mouse(tagCanvas),
    })

    // create camera entity
    var camera = new pc.Entity('camera')
    camera.addComponent('camera', {
        clearColor: new pc.Color(0, 0, 0)
    })
    camera.setPosition(0, 0, 3)

    // define scripts after app created by pc
    defineMyScript()

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

const  M = {
    setup
}
//
export default M
module.exports = M
