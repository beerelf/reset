import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
// guess I need to compare this to useCatenaKeycloak in er2_m4
const keycloak = new Keycloak({
    url: 'http://localhost:8088/',
    // url: 'http://localhost:8088/realms/reset/protocol/openid-connect/auth',

    realm: 'reset',
    clientId: 'resetclient',
})

console.log('oi', keycloak)

// async function oi() {
//     try {
//         const authenticated = await keycloak.init()
//         if (authenticated) {
//             console.log('User is authenticated')
//         } else {
//             console.log('User is not authenticated')
//         }
//     } catch (error) {
//         console.error('Failed to initialize adapter:', error)
//     }
// }

// oi()

export default keycloak
