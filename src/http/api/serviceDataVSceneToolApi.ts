import http from '~/http/Http'

const getServiceDataVSceneToolList = () => {
  return http.get('/serviceDataVSceneTool')
}

export default {
  getServiceDataVSceneToolList
}