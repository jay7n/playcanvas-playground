import { Stupid3DAppClass }  from './3d'
import { underPath } from '@/utils/methods'

async function main() {
    const canvas = document.getElementById('canvas')
    const app = new Stupid3DAppClass(canvas)
    app.init().then(() => {
        // console.log('fffffffffff')
        app.updateModelFromURL(underPath.assets('3d-models/from_rayion/newlongtou/longtou.json'))
    })
    // app.updateModelFromURL(underPath.assets('3d-models/my_sofa/georgetti_51960.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/Wooden_Crate/Wooden_Crate.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/Tree/Tree.json'))

    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test05/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test07/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test08/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test09/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test30/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test33/output.json'))
}

main()
