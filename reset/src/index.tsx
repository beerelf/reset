import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import store from './app/store'
import { Provider } from 'react-redux'
import { useKeycloak, ReactKeycloakProvider } from '@react-keycloak/web'
// import { onSigninCallback, queryClient, userManager } from './keycloak'
import keycloak from './keycloak_try'

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// the ReactKeycloakProvider is causing the problem
root.render(
    <ReactKeycloakProvider authClient={keycloak}>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </ApolloProvider>
    </ReactKeycloakProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
