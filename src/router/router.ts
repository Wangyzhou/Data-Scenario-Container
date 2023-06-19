import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Session } from '~/cache/index'
import { ElMessage } from 'element-plus'
import { useUserStore } from '~/store/user'
import { useCatalogStore } from '~/store/catalog'
import { usePublicStore } from '~/store/publicStore'
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'default',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('~/pages/LoginAndRegisterPage.vue'),
        meta: {
            requireLogin: false
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('~/pages/HomePage.vue'),
        meta: {
            requireLogin: false
        },
        children: [
            {
                path: '',
                name: 'overview',
                component: () => import('~/pages/HomeView/DefaultMain.vue'),
                redirect: '/home',
                children: [
                    {
                        path: '',
                        name: 'overviewmain',
                        component: () => import('~/pages/HomeView/OverviewMain.vue'),
                        meta: {
                            requireLogin: true
                        }
                    },
                    {
                        path: 'data',
                        name: 'data',
                        component: () => import('~/pages/HomeView/Data.vue'),
                        meta: {
                            requireLogin: true
                        }
                    },
                    {
                        path: 'tool',
                        name: 'tool',
                        component: () => import('~/pages/HomeView/Tool.vue'),
                    },
                    {
                        path: 'scene',
                        name: 'scene',
                        component: () => import('~/pages/HomeView/ScenePage/SceneMain.vue'),
                        children: [
                            {
                                path: '',
                                component: () => import('~/pages/HomeView/ScenePage/Scene.vue'),
                            },
                            {
                                path: 'createScene',
                                component: () => import('~/pages/HomeView/ScenePage/CreateScene.vue'),
                                redirect: 'scene/createScene/1',
                                children: [
                                    {
                                        path: '1',
                                        component: () => import('~/pages/HomeView/ScenePage/SceneSelect.vue')
                                    },
                                    {
                                        path: '2',
                                        component: () => import('~/pages/HomeView/ScenePage/SelectData.vue')
                                    },
                                    {
                                        path: '3',
                                        component: () => import('~/pages/HomeView/ScenePage/SelectTools.vue')
                                    },
                                    {
                                        path: '4',
                                        component: () => import('~/pages/HomeView/ScenePage/CreateSceneInfoConfirm.vue')
                                    }
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                path: 'mapDataSceneEditor/:id',
                name: 'mapDataSceneEditor',
                component: () => import('~/pages/HomeView/MapDataSceneEditor.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, _from, next) => {
    // if (!Session.get('token')) {
    //     ElMessage({
    //         type: 'error',
    //         message: '未登录，请先登录！'
    //     })
    //     next({ path: '/login' })
    // }
    if (!to.meta.requireLogin) {
        next()
    }
    if (!Session.get('token')) {
        ElMessage({
            type: 'error',
            message: '未登录，请先登录！'
        })
        next({ path: '/login' })
    }
    // console.log(to.path)
    const publicStore = usePublicStore()
    switch (to.path) {
        case '/home':
            publicStore.updateActiveIndex('1')
            break;
        case '/home/data':
            publicStore.updateActiveIndex('2')
            break;
        case '/home/tool':
            publicStore.updateActiveIndex('3')
            break;
        case '/home/scene':
            publicStore.updateActiveIndex('4')
            break;
        case '/home/project':
            publicStore.updateActiveIndex('5')
            break;
        default:
            break;
    }
    // console.log(to.meta.requireLogin)
    const userStore = useUserStore()
    userStore.setToken(Session.get('token'))
    userStore.setLoginUser(Session.get('login_user'))
    // console.log(Session.get('catalogInfo'))
    if (Session.get('currentCatalogId')) {
        const catalogStore = useCatalogStore()
        catalogStore.updateCurrentCatalogId(Session.get('currentCatalogId'))
        catalogStore.setRootCatalog(Session.get('rootCatalog'))
        catalogStore.setBreadCrumb(Session.get('breadcrumb'))
    }
    next()
})
// router.beforeEach((to, _from, next) => {
//     // let path = to.path
//     // //白名单不必验证token和权限
//     // if (!Session.get('token')) {
//     //     ElMessage({
//     //         type: 'error',
//     //         message: '未登录，请先登录！'
//     //     })
//     //     next({ path: '/' })
//     // }
//     // console.log(path)
//     next()
//     // if (whiteNameRouters.indexOf(path) > -1 && path != '/') {
//     //     return next()
//     // }
//     // //其他路由如果没有token则跳转到登录页面
//     // let token = Session.get('token')
//     // if (!token) {
//     //     ElMessage.warning('请先登录!')
//     //     return next('/login')
//     // }
//     // //防刷新处理
//     // let userInfoStore = useUserInfoStore()
//     // setUserStore(userInfoStore)
//     // let needRoleCode = ''
//     // if (to.meta && to.meta.roleCode) {
//     //     needRoleCode = to.meta.roleCode as string
//     // }
//     // //当前路径不需要权限时,执行跳转
//     // if (needRoleCode === '' || !needRoleCode) {
//     //     return next()
//     // }

//     // let roleCodeArr: string[] = userInfoStore.userInfo.roleCode
//     // roleCodeArr = userInfoStore.userInfo.roleCode
//     // if (!roleCodeArr || roleCodeArr.length === 0) {
//     //     return next('/login')
//     // }
//     // if (roleCodeArr!.indexOf(needRoleCode) > -1) {
//     //     return next()
//     // } else {
//     //     return next('/login')
//     // }
// })
export default router
