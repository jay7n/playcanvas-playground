import { Stupid3DAppClass }  from './3d'
import { underPath } from '@/utils/methods'

async function main() {
    const canvas = document.getElementById('canvas')
    const app = new Stupid3DAppClass(canvas)
    app.init()
    // app.updateModelFromURL(underPath.assets('3d-models/my_sofa/georgetti_51960.json'))
}

main()
