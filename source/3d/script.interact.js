import pc from 'play-canvas'
import _ from 'lodash'

export function DefineOrbitCameScripts(scriptName) {
    const OrbitCameraScript = pc.createScript(scriptName)

    OrbitCameraScript.prototype.initialize = function() {
        Object.assign(this, {
            mousePreviousPos: new pc.Vec2(),
            mouseSensitivity: 0.3,
            mouseEnabled: false,
            anglesAroundXY: new pc.Vec2(),
            initialPos: this.entity.getPosition().clone(),
        })

        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this)
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this)
    }

    OrbitCameraScript.prototype.onMouseDown = function() {
        this.mouseEnabled = true
    }

    OrbitCameraScript.prototype.onMouseMove = function(event) {
        if (this.mouseEnabled && !_.isEmpty(this.mousePreviousPos)) {
            const factor = this.mouseSensitivity * -1
            const angsAround = this.anglesAroundXY

            angsAround.x = pc.math.clamp(angsAround.x + (event.y - this.mousePreviousPos.y) * factor, -90, 90)
            angsAround.y = (angsAround.y + (event.x - this.mousePreviousPos.x) * factor) % 360

            const quat = new pc.Quat().setFromEulerAngles(angsAround.x, angsAround.y, 0)
            const pos = quat.transformVector(this.initialPos)

            this.entity.setPosition(pos)
            this.entity.lookAt(0,0,0)
        }
        this.mousePreviousPos.x = event.x
        this.mousePreviousPos.y = event.y
    }

    OrbitCameraScript.prototype.onMouseUp = function() {
        this.mouseEnabled = false
    }
}
