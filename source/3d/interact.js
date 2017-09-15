import pc from 'play-canvas'

import { axisAngleToQuaternion } from './utils'

function _new_material() {
    const m = new pc.StandardMaterial()
    m.diffuse.set(110/255, 193/255, 165/255)
    m.update()

    return m
}

export function defineMyScript() {
    const MyScript = pc.createScript('my')

    MyScript.attributes.add('anum', {
        type: 'number',
        default: 10
    })

    MyScript.prototype.initialize = function() {
        Object.assign(this, {
            mouseStartPos: [],
            camera: this.app.root.findByName('camera').camera,
            mouseEnabled: false,
            entityRotation: new pc.Quat(),
        })

        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this)
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this)

        // const m = _new_material()

        // const mis = this.entity.model.meshInstances
        // for (const mi of mis) {
        //     mi.material = m
        // }
    }

    MyScript.prototype.onMouseMove = function(event) {
        if (this.mouseEnabled) {
            const step = 0.3
            const mouseDist = [event.x, event.y].map((elm, idx) => elm - this.mouseStartPos[idx])

            // well, I have a home-made method which also get the same resule
            // const q1 = axisAngleToQuaternion([0,1,0], 1 * mouseDist[0])
            //
            const q = new pc.Quat().setFromAxisAngle(pc.Vec3.UP, step * mouseDist[0])
            q.mul(this.entityRotation)
            this.entity.setRotation(q)
            // const q2 = new pc.Quat().setFromAxisAngle(pc.Vec3.RIGHT, step * mouseDist[1])
            // this.entity.setRotation(q2)
            // const q = new pc.Quat().mul2(q2, q1)

            // q.mul(this.entityRotation)
            // this.entity.setRotation(q)
        }
    }

    MyScript.prototype.onMouseUp = function(event) {
        this.mouseEnabled = false
    }

    MyScript.prototype.onMouseDown = function(event) {
        this.mouseStartPos = [event.x, event.y]
        this.mouseEnabled = true
        this.entityRotation = this.entity.getRotation()
    }

    MyScript.prototype.update = function() {

    }

    return MyScript
}
