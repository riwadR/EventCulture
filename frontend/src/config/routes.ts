export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LEGAL: '/legal',
  EVENTS: '/events',
  EVENT_DETAILS: '/event/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CATALOGUES: '/catalogues',
  LIEUX: '/lieux'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.LEGAL,
  ROUTES.EVENTS,
  ROUTES.EVENT_DETAILS,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.LIEUX,
];

export const PRIVATE_ROUTES: RoutePath[] = [
  ROUTES.PROFILE,
  ROUTES.CATALOGUES,
]; 