export const APP_ROUTES = {
    HOME: '/',
    AUTH: {
        SIGN_IN: '/signin',
        SIGN_UP: '/signup',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password'
    },
    DASHBOARD: {
        ROOT: '/dashboard',
        ACCOUNT: '/dashboard/account',
        USERS: '/dashboard/users'
    }
};

export const PUBLIC_ROUTES = [APP_ROUTES.HOME];
export const AUTH_ROUTES = [
    APP_ROUTES.AUTH.SIGN_IN,
    APP_ROUTES.AUTH.SIGN_UP,
    APP_ROUTES.AUTH.FORGOT_PASSWORD,
    APP_ROUTES.AUTH.RESET_PASSWORD
];

export const DEFAULT_AUTHENTICATED_REDIRECT_ROUTE = APP_ROUTES.DASHBOARD.ROOT;
