import pc from 'play-canvas'
import _ from 'lodash'

import { underPath } from '@/utils/methods'

import { DefineOrbitCameraScript, DefineFxaaScript }  from './3d/scripts'
import { calcEntityAabb, focusCameraOnEntity, createCubeMap } from './3d/utils'

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

    async _initScene() {
        // const cubeMapRootURL = underPath.assets('3d-models/from_rayion/Helipad/9241043/')
        // let cubeMap = await createCubeMap(this.app, 'mycubemap', `${cubeMapRootURL}Helipad.dds`, [
        //     `${cubeMapRootURL}../9241039/Helipad_posx.png`,
        //     `${cubeMapRootURL}../9241037/Helipad_negx.png`,
        //     `${cubeMapRootURL}../9241038/Helipad_posy.png`,
        //     `${cubeMapRootURL}../9241041/Helipad_negy.png`,
        //     `${cubeMapRootURL}../9241042/Helipad_posz.png`,
        //     `${cubeMapRootURL}../9241040/Helipad_negz.png`,
        // ])
        //
        // this.cubeMap = cubeMap

        // this.app.setSkybox(cubeMap)
        // console.log(cubeMap)
        // this.app.scene.setSkybox(cubeMap.resources)
        // this.app.scene.setSkybox(cubeMap.resources)


        // this.cubeMap = this.app.assets.get(cubeMap)
        // console.log(cubeMap)
        // this.app.setSkybox(cubeMap)
        // const cubeMapURL = underPath.assets('3d-models/from_rayion/Helipad/9241043/Helipad.json')
        // this.app.assets.loadFromUrl(cubeMapURL, 'cubemap', (err, asset) => {
        //     if (err) {
        //         console.log(err)
        //     }
        //     console.log(asset)
        // })
    }

    _initScripts() {
        // console.log(DefineOrbitCameScript)
        DefineOrbitCameraScript('interact')
        DefineFxaaScript('fxaa')
    }

    _initLight() {
        const light = new pc.Entity('light')
        this.app.root.addChild(light)

        light.addComponent('light', {
            type: 'directional',
            color: new pc.Color(1,1,1),
        })

        // light.setPosition(0, 10, 10)
        // light.setPosition(0,0,10)
        // light.lookAt(0,0,0)
        light.rotate(45,45,0)

        this.light = light

        this.app.scene.ambientLight = new pc.Color(1,1,1)
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
    }

    _initCamera() {
        let camera = this.camera

        if (!camera) {
            camera = new pc.Entity('camera')
            camera.addComponent('camera', {
                clearColor: new pc.Color(0.8, 0.8, 0, 0)
            })
            this.app.root.addChild(camera) // camera needs to be added first, cuz scripts attached in entity will use it when get initialized

            focusCameraOnEntity(camera, this.entityAabb, this.app.touch)
            camera.addComponent('script')
            camera.script.create('interact')
            // camera.script.create('fxaa')


            this.camera = camera
        } else {
            focusCameraOnEntity(camera, this.entityAabb, this.app.touch)
            this.camera.script.interact.fire('focus', this.entityAabb.center)
        }
    }


    // # public methods
    //
    async init() {
        this._initApp()
        await this._initScene().then(() => {
            console.log('eeeeeeee')
            this._initScripts()
            this._initLight()
            this._initEntity()
            this._initCamera()
        })
    }

    updateModelFromURL(modelURL) {
        return new Promise((resolve, reject) => {
            if (!_.isString(modelURL)) reject('no valid URL provided')

            // const asset = new pc.Asset('mymodel', 'model', {
            //     url: modelURL
            // }, {
            //     type: 'asset'
            // })
            // console.log(asset)
            // this.app.assets.add(asset)
            // this._initEntity('asset', asset)
            // this._initCamera()
            // resolve()

            this.app.assets.loadFromUrl(modelURL, 'model', (err, asset) => {
                console.log(asset)
                asset.preload = true
                if (err) reject(err)
                else {
                    // const resource = asset.resource
                    // for (let mi of resource.meshInstances) {
                    //     mi.material.cubeMap = this.cubeMap.resource
                    //     mi.material.update()
                    //     // console.log(mi.material)
                    // }
                    this._initEntity('asset', asset)
                    this._initCamera()
                    resolve()
                }
            })
        })
    }
}
