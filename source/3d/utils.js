import mathjs from 'mathjs'
import pc from 'play-canvas'

export const PI = 3.1415926

export function angleToRadius(angle) {
    return PI * angle / 180
}

export function radiusToAngle(radius) {
    return radius * 180 / PI
}

export function axisRadiusToQuaternion(axis, radius, returnType = Array) {
    const halfRadius = radius * 0.5
    const axisType = Object.getPrototypeOf(axis).constructor

    if (axisType == Object) {
        axis = [axis.x, axis.y, axis.z]
    }

    const partial = mathjs.sin(halfRadius)
    const vec3 = axis.map(elm => elm * partial)
    const ret = vec3.concat(mathjs.cos(halfRadius))

    if (returnType == Array) {
        return ret
    } else if (returnType == Object) {
        return {x: ret[0], y: ret[1], z: ret[2], w: ret[3]}
    }
}

export function axisAngleToQuaternion(axis, angle, returnType = Array) {
    const raduis = angleToRadius(angle)
    return axisRadiusToQuaternion(axis, raduis, returnType)
}

export function calcEntityAabb(entity) {
    const aabb = new pc.BoundingBox()
    const mis = entity.model.meshInstances
    aabb.copy(mis[0].aabb)
    for (const mi of mis ) {
        aabb.add(mi.aabb)
    }

    return aabb
}

export function focusCameraOnEntity(camera, entityAabb, isTouchDevice) {
    const halfExtents = entityAabb.halfExtents
    let distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z))
    distance = (distance / Math.tan(0.5 * camera.camera.fov * pc.math.DEG_TO_RAD)) * 2
    const cameraPos = entityAabb.center.clone()
    const extraDistance = isTouchDevice ? 5 : 0
    // const extraDistance = isTouchDevice ? -1 : -1
    cameraPos.z += distance + extraDistance
    camera.setPosition(cameraPos)
    camera.lookAt(entityAabb.center)
}

export function createCubeMap(app, name, ddsURL, textureMapURLs) {
    return new Promise((resolve, reject) => {
        const textures = textureMapURLs.map(function(v, i) {
            var asset = new pc.Asset(
                name + '-' + i, 'texture',
                { url: v }
            )
            app.assets.add(asset)
            return asset.id
        })

        const cubeMap = new pc.Asset(
            name,
            'cubemap',
            // { url: ddsURL },
            null,
            {
                anisotropy: 1,
                magFilter: 1,
                minFilter: 5,
                rgbm: true,
                textures: textures,
            }
        )
        // cubeMap.loadFaces = true

        app.assets.on('load:'+cubeMap.id, (asset) => {
            console.log('im loaded')
            app.assets.add(asset)
            // app.scene.setSkybox(asset.resources)
            resolve(asset)
        })
        app.assets.load(cubeMap)
    })
}
