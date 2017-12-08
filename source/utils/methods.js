import URI from 'urijs'

import { appRoot } from '@/utils/consts'

const underPath = {
    assets: (subPath) => {
        const sp = URI(subPath).pathname()
        return `${appRoot}/assets/${sp}`
    }
}

async function getJson(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.addEventListener("load", () => {
            resolve(JSON.parse(xhr.responseText))
        })
        xhr.addEventListener("error", (error) => {
            reject(error)
        })
        xhr.open('GET', url)
        xhr.send()
    })
}

export {
    underPath,
    getJson
}
