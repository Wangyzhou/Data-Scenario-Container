import http from '~/http/http';

const createScene = (data: any) => http.post('/scene', data);

const getSceneList = (userId: string) => http.get('/scene?userId=' + userId);

const getSceneConfig = (sceneType: string, sceneId: string) => http.get('/scene/getSceneConfig?sceneType=' + sceneType + '&sceneId=' + sceneId);

const deleteScene = (sceneId: string) => http.delete('/scene?sceneId=' + sceneId);

const saveScene = (saveSceneParams: any, config: any) => http.upload('/scene/save', saveSceneParams, config);

export default {
  createScene,
  getSceneList,
  getSceneConfig,
  deleteScene,
  saveScene
}