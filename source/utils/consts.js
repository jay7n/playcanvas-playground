import URI from 'urijs'

const _wlh = window.location.href  // https://www.rayion.com/webvr/dist/index.html:8086?a=1&b=2'
export const appUri = URI(_wlh)
export const appRoot = `${appUri.origin()}${appUri.directory()}`
