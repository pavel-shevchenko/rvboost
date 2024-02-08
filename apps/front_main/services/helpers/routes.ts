export const Routes = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  accountSettings: '/settings/account',
  dashboard: '/dashboard',
  newclient: '/newclient',
  users: '/users',
  companies: '/companies',
  subscriptions: '/subscriptions',
  locations: '/locations',
  cards: '/cards',
  links: '/links',
  reviews: '/reviews',
  feedbackSettings: '/feedback',
  fbSettingsCreate: '/feedback/create',
  fbSettingsEdit: (id: string) => `/feedback/edit/${id}`
} as const;
