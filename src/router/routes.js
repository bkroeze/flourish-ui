

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'aave', component: () => import('pages/Aave.vue') },
      { path: 'account/', component: () => import('pages/AccountLanding.vue') },
      { path: 'account/:acct', component: () => import('pages/AccountTracker.vue') },
      { path: 'tarot/', component: () => import('pages/TarotDealer.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
