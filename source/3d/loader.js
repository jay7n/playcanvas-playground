import { underPath } from '@/utils/methods'

async function _loadFromUrl(app, type, url) {
    return new Promise((resolve, reject) => {
        app.assets.loadFromUrl(url, type, (err, asset) => {
            if (err) {
                reject(err)
            } else {
                resolve(asset)
            }
        })
    })
}

export async function loadMaterialFromUrl(app, url) {
    return new Promise((resolve, reject) => {
        _loadFromUrl(app, 'texture', underPath.assets('3d-models/ball/9016139/Sphere.png')) // TODO: make it dynamically
            .then((texture) => {
                app.assets.loadFromUrl(url, 'material', (err, asset) => {
                    if (err) {
                        reject(err)
                    } else {
                        const material = asset.resource
                        material.diffuseMap = texture
                        resolve(asset.resource)
                    }
                })
            })
    })
}
