import pc from 'play-canvas'
import _ from 'lodash'

import { underPath } from '@/utils/methods'

import { DefineOrbitCameScripts }  from './script.interact'
import { loadMaterialFromUrl } from './loader'
import { calcEntityAabb, focusCameraOnEntity } from './utils'

window.pc = pc

export class Stupid3DAppClass {

    constructor(canvas) {
        this.canvas = canvas

        this.app = null
        this.camera = null
        this.light = null
        this.entity = null
        this.entityAabb = null
    }

    // internal methods
    //
    _initApp() {
        const app = new pc.Application(this.canvas, {
            mouse: new pc.Mouse(this.canvas),
            touch: 'ontouchstart' in window ? new pc.TouchDevice(this.canvas) : null,
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
        DefineOrbitCameScripts('interact')
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

        // this.app.scene.ambientLight = new pc.Color(0.5,0.5,0.5)
    }


    _initEntity(type='box', asset) {
        let entity = this.entity

        if (entity) {
            entity.destroy()
            this.app.root.removeChild(entity)
        }

        entity = new pc.Entity('myentity')
        this.app.root.addChild(entity)

        const modelOptions = { type }
        if (type == 'asset') {
            Object.assign(modelOptions, { asset })
        }

        entity.addComponent('model', modelOptions)
        entity.setPosition(0,0,0)
        // entity.model.material.cull = pc.CULLFACE_FRONT

        this.entityAabb = calcEntityAabb(entity)
        this.entity = entity
        console.log(entity)
    }

    _initCamera() {
        let camera = this.camera

        if (!camera) {
            camera = new pc.Entity('camera')
            camera.addComponent('camera', {
                clearColor: new pc.Color(0, 0, 0)
            })
            this.app.root.addChild(camera) // camera needs to be added first, cuz scripts attached in entity will use it when get initialized

            focusCameraOnEntity(camera, this.entityAabb, this.app.touch)
            camera.addComponent('script')
            camera.script.create('interact')

            this.camera = camera
        } else {
            focusCameraOnEntity(camera, this.entityAabb, this.app.touch)
            this.camera.script.interact.fire('focus', this.entityAabb.center)
        }
    }


    // # public methods
    //
    init() {
        this._initApp()
        this._initScripts()
        this._initLight()
        this._initEntity()
        this._initCamera()
    }

    updateModelFromURL(modelURL) {
        return new Promise((resolve, reject) => {
            if (!_.isString(modelURL)) reject('no valid URL provided')

            this.app.assets.loadFromUrl(modelURL, 'model', (err, asset) => {
                if (err) reject(err)
                else {
                    this._initEntity('asset', asset)
                    this._initCamera()
                    resolve()
                }
            })
        })
    }
}
