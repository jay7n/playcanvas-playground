import URI from 'urijs'

import { appRoot } from '@/utils/consts'

export const underPath = {
    assets: (subPath) => {
        const sp = URI(subPath).pathname()
        return `${appRoot}/assets/${sp}`
    }
}
