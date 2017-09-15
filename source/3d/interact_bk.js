
import pc from 'play-canvas'
import mathjs from 'mathjs'

import { axisAngleToQuaternion } from './utils'

export function defineMyScript() {
    const MyScript = pc.createScript('my')

    MyScript.attributes.add('anum', {
        type: 'number',
        default: 10
    })

    MyScript.prototype.initialize = function() {
        Object.assign(this, {
            previousMousePos: [],
            camera: this.app.root.findByName('camera').camera,
            mouseEnabled: false,
            entityRotation: new pc.Quat(),
            stepAngle: 2,
            rotatingPrimaryAxis: null,
        })

        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this)
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this)
    }

    MyScript.prototype.onMouseMove = function(event) {

        if (this.mouseEnabled) {
            const axisAngle = [event.x, event.y].map((elm, idx) => {
                const direction = idx ? [pc.Vec3.RIGHT, pc.Vec3.LEFT] : [pc.Vec3.UP, pc.Vec3.DOWN]
                const d = elm - this.previousMousePos[idx]
                if (mathjs.equal(d, 0)) return null
                return [d > 0 ? direction[0] : direction[1], this.stepAngle, d]
            })

            if (!this.rotatingPrimaryAxis) {
                if (axisAngle[0] && axisAngle[1]) {
                    if (axisAngle[0][2] > axisAngle[1][2]) {
                        this.rotatingPrimaryAxis = 'Y'
                    } else {
                        this.rotatingPrimaryAxis = 'X'
                    }
                } else if (axisAngle[0] && !axisAngle[1]) {
                    this.rotatingPrimaryAxis = 'Y'
                } else if (!axisAngle[0] && axisAngle[1]) {
                    this.rotatingPrimaryAxis = 'X'
                }
                console.log(this.rotatingPrimaryAxis)
            }

            // well, I have a home-made method which also gets the same resule
            // const q1 = axisAngleToQuaternion([0,1,0], 1 * mouseDist[0])
            //
            const q = new pc.Quat()
            q.mul(this.entityRotation)

            if (this.rotatingPrimaryAxis == 'Y' && axisAngle[0]) {
                q.mul(new pc.Quat().setFromAxisAngle(...axisAngle[0]))
            } else if (this.rotatingPrimaryAxis == 'X' && axisAngle[1]) {
                q.mul(new pc.Quat().setFromAxisAngle(...axisAngle[1]))
            }
            this.entity.setRotation(q)

            this.previousMousePos = [event.x, event.y]
        }
    }

    MyScript.prototype.onMouseUp = function(event) {
        this.mouseEnabled = false
        this.rotatingPrimaryAxis = null
        console.log(this.rotatingPrimaryAxis)
    }

    MyScript.prototype.onMouseDown = function(event) {
        this.mouseEnabled = true
        this.entityRotation = this.entity.getRotation()
    }

    MyScript.prototype.update = function() {

    }

    return MyScript
}
