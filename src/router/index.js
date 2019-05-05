import Vue from 'vue'
import Router from 'vue-router'

const Recommend = (resolve) => {
  import('../components/Recommend/Recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('../components/Singer/Singer').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('../components/Rank/Rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('../components/Search/Search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('../components/Singer-detail/Singer-detail').then((module) => {
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('../components/Disc/Disc').then((module) => {
    resolve(module)
  })
}

const RankDetail = (resolve) => {
  import('../components/Rank-detail/Rank-detail').then((module) => {
    resolve(module)
  })
}

const SearchResult = (resolve) => {
  import('../components/Search-result/Search-result').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('../components/User-center/User-center').then((module) => {
    resolve(module)
  })
}

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: '/recommend/detail',
      component: Disc
    }]
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: '/singer/detail',
      component: SingerDetail
    }]
  }, {
    path: '/rank',
    component: Rank,
    children: [{
      path: '/rank/detail',
      component: RankDetail
    }]
  }, {
    path: '/search',
    component: Search,
    children: [{
      path: '/search/result',
      component: SearchResult,
      children: [{
        path: '/search/result/disc',
        component: Disc
      }, {
        path: '/search/result/singer',
        component: SingerDetail
      }]
    }]
  }, {
    path: '/user',
    component: UserCenter
  }]
})
