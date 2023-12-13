/// <reference types="cypress" />

Cypress.Commands.add('loginViaApi', (email, password) => {
    cy.request('POST', `${Cypress.config().baseUrl}/users/login`, {
                email: email,
                password: password
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('token').not.to.be.empty;
                Cypress.env('token', response.body.token)
            })
})

Cypress.Commands.add("logoutViaApi", (token) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.config().baseUrl}/users/logout`,
        auth: {
            'bearer': token
        },
    }).then((response) => {
        expect(response.status).to.eq(200);
    })
})

Cypress.Commands.add('httpRequest', (method: string, url: string, token: string, body?: {}) => {
    return cy.request({
        method: method,
        url: url,
        auth: {
            'bearer': token
        },
        body: body
    })
})

Cypress.Commands.add("login", (username: string, password: string) => {
    const log = Cypress.log({
        name: "login",
        displayName: "LOGIN",
        message: [`🔐 Authenticating | ${username}`],
      });

      cy.intercept("POST", "/users/login").as("loginUser");
    
      cy.visit("/");

      cy.get("#email").type(username);
      cy.get("#password").type(password);

      cy.get("#submit").click();

      // examples how to assert intercepted request
      cy.wait("@loginUser").then(intercept => {
        expect(intercept.response?.statusCode).eq(200)
        expect(intercept.request.body).to.have.property('email').to.eq(username)
      })

      cy.get("@loginUser").its('response.body').should('have.a.property', 'token').and('not.be.null');
      cy.get("@loginUser").its('response.statusCode').should('eq', 200);
      cy.get("@loginUser").its('response.statusMessage').should('eq', "OK");
      cy.get("@loginUser").its('response.body.user').should('have.a.property', 'email')
      cy.get("@loginUser").its('request.body').should('have.a.property', 'email').and('equal', username).and('be.a', 'string')
    })