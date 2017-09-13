const pc = require('play-canvas')

const assetsPath = '/assets/3d-models'

async function _create_entity(app) {
    return new Promise((resolve, reject) => {
        app.assets.loadFromUrl(`${assetsPath}/my_sofa/georgetti_51960.json`, "model", function (err, asset) {
            if (err) {
                reject(err)
            } else {
                const entity = new pc.Entity('my_sofa')
                entity.addComponent('model', {
                    type: 'asset',
                    asset,
                })
                resolve(entity)
            }
        })
    })
}

async function setup(hDivApp) {
    // create a PlayCanvas application
    var hCanvas = document.createElement('canvas')
    hCanvas.id = 'canvas'

    hDivApp.appendChild(hCanvas)

    var app = new pc.Application(hCanvas, { })
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
    entity.rotate(0, 90, 0)
    // entity.rotate(90,0,0)
    entity.setPosition(3,0,0)

    // create camera entity
    var camera = new pc.Entity('camera')
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.5, 0.1, 0.1)
    })

    // create directional light entity
    var light = new pc.Entity('light')
    light.addComponent('light', {
        color: new pc.Color(1,1,1),
        range: 10,
    })
    light.setPosition(0, 0, -3)

    // set up initial positions and orientations
    camera.setPosition(1, 1, 6)
    light.setEulerAngles(45, 0, 0)

    // add to hierarchy
    app.root.addChild(entity)
    app.root.addChild(camera)
    app.root.addChild(light)

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
