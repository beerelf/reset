import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { AuthProvider } from 'react-oidc-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'
import { onSigninCallback, queryClient, userManager } from './config'
import './index.css'
import App from './App'
import store from './app/store'
import { ProtectedApp } from './components/ProtectedApp'

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    cache: new InMemoryCache(),
})

console.log('userManager', userManager)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// the ReactKeycloakProvider is causing the problem
root.render(
    <React.StrictMode>
        <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
            <QueryClientProvider client={queryClient}>
                <ApolloProvider client={client}>
                    <Provider store={store}>
                        <ProtectedApp>
                            <App />
                        </ProtectedApp>
                    </Provider>
                </ApolloProvider>
            </QueryClientProvider>
        </AuthProvider>
    </React.StrictMode>
)
