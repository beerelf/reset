import { QueryClient } from '@tanstack/react-query'
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

// VITE_PORT=5173
// VITE_AUTHORITY=http://localhost:8080/realms/master
// VITE_CLIENT_ID=react
// VITE_API_BASE_URL=http://api:5174

export const userManager = new UserManager({
    // authority: import.meta.env.VITE_AUTHORITY,
    authority: 'http://localhost:8088/realms/reset',
    // client_id: import.meta.env.VITE_CLIENT_ID,
    client_id: 'resetclient',
    redirect_uri: `${window.location.origin}${window.location.pathname}`,
    post_logout_redirect_uri: window.location.origin,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    monitorSession: true, // this allows cross tab login/logout detection
})

export const onSigninCallback = () => {
    window.history.replaceState({}, document.title, window.location.pathname)
}

export const queryClient = new QueryClient()
