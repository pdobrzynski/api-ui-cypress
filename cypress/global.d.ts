declare namespace Cypress {
    interface Chainable {
        loginViaApi(email: string, password: string): Chainable<any>
        logoutViaApi(token: string): Chainable<any>
        httpRequest(method: string, url: string, token: string, body?: any): Chainable<any>
        login(username: string, password: string): Chainable<any>
    }
}