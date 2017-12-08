import { Stupid3DAppClass }  from './3d'
import { underPath, getJson } from '@/utils/methods'

async function main() {
    const canvas = document.getElementById('canvas')
    const app = new Stupid3DAppClass(canvas)
    app.init().then(() => {
        // app.updateModelFromURL(underPath.assets('haier/data/chicun.json'))
    })

    getJson(underPath.assets('haier/config.pc.json')).then((data) => {
        console.log(data)
    })

    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Football/Football.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test05/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test07/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test08/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test09/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test30/output.json'))
    // app.updateModelFromURL(underPath.assets('3d-models/from_rayion/Test33/output.json'))
}

main()
