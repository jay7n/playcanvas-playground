import pc from 'play-canvas'
import _ from 'lodash'


export function DefineOrbitCameScripts(scriptName) {
    const OrbitCameraScript = pc.createScript(scriptName)

    // private methods
    OrbitCameraScript.prototype._updateEntity = function(previousPos, currentPos, factor) {
        factor = factor * -1
        const angsAround = this.anglesAroundXY

        angsAround.x = pc.math.clamp(angsAround.x + (currentPos.y - previousPos.y) * factor, -89.5, 89.5)
        angsAround.y = (angsAround.y + (currentPos.x - previousPos.x) * factor) % 360

        this.quat = new pc.Quat().setFromEulerAngles(angsAround.x, angsAround.y, 0)
        const pos = this.quat.transformVector(this.initialPos)

        this.entity.setPosition(pos)
        this.entity.lookAt(this.lookAt)
    }


    // interfaces
    OrbitCameraScript.prototype.initialize = function() {
        Object.assign(this, {
            mousePreviousPos: new pc.Vec2(),
            mouseSensitivity: 0.2,
            mouseEnabled: false,
            touchPreviousPos: new pc.Vec2(),
            touchSensitivity: 0.3,
            anglesAroundXY: new pc.Vec2(),
            initialPos: this.entity.getPosition().clone(),
            quat: null,
            lookAt: new pc.Vec3(0,0,0),
        })

        // listen Mouse Events
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this)
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this)

        // listen Touch Events
        if (this.app.touch) {
            this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this)
            this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this)
        }

        pc.events.attach(this)

        this.on('focus', this.onFocus, this)
    }

    OrbitCameraScript.prototype.onMouseDown = function(event) {
        this.mouseEnabled = true
        this.mousePreviousPos.x = event.x
        this.mousePreviousPos.y = event.y
    }

    OrbitCameraScript.prototype.onMouseMove = function(event) {
        if (this.mouseEnabled) {
            const mouseCurrentPos = new pc.Vec2(event.x, event.y)
            this._updateEntity(this.mousePreviousPos, mouseCurrentPos, this.mouseSensitivity)

            this.mousePreviousPos.x = event.x
            this.mousePreviousPos.y = event.y
        }
    }

    OrbitCameraScript.prototype.onMouseUp = function() {
        this.mouseEnabled = false
    }

    OrbitCameraScript.prototype.onTouchStartEndCancel = function(event) {
        const touch = event.touches[0]
        this.touchPreviousPos.x = touch.x
        this.touchPreviousPos.y = touch.y
    }


    OrbitCameraScript.prototype.onTouchMove = function(event) {
        const touch = event.touches[0]

        const touchCurrentPos = new pc.Vec2(touch.x, touch.y)
        this._updateEntity(this.touchPreviousPos, touchCurrentPos, this.touchSensitivity)

        this.touchPreviousPos.x = touch.x
        this.touchPreviousPos.y = touch.y
    }

    OrbitCameraScript.prototype.onFocus = function(lookAt) {
        this.initialPos = this.entity.getPosition().clone()
        this.lookAt = lookAt.clone()

        if (this.quat) {
            const pos = this.quat.transformVector(this.initialPos)

            this.entity.setPosition(pos)
            this.entity.lookAt(lookAt)
        }
    }
}
