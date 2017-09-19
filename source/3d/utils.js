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
    for (const mi of mis ) {
        aabb.add(mi.aabb)
    }

    return aabb
}
