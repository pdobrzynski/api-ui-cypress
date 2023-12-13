import { faker } from "@faker-js/faker";

const sizes = ['iphone-7', 'ipad-2', [1024, 768]]
let logoutText: any;
describe('Auth test suite', () => {
    sizes.forEach((size) => {
        it(`should login and redirect to contact list page on ${size} screen`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
              } else {
                cy.viewport(size)
              }

            cy.login(Cypress.env('email'), Cypress.env('password'))
            cy.location("pathname").should("equal", "/contactList");
            cy.get("#logout").invoke('text').then((text) => {
                logoutText = text;
                expect(logoutText).to.eq('Logout');
                cy.wrap(text).should('eq', logoutText)
            });            

        })
    })

    it('should allow to sign-up, login and logout', () => {
        cy.visit("/");

        // sign-up
        cy.get('#signup').as('signupButton').click();
        cy.get('form').within(() => {
            cy.get('#firstName').type(faker.person.firstName())
            cy.get('#lastName').type(faker.person.lastName())
            cy.get('#email').type(faker.internet.email())
            cy.get('#password').type(faker.internet.password({length: 8}))
        })
        
        // login
        cy.get('#submit').click()
        cy.location("pathname").should("equal", "/contactList");

        // logout
        cy.get('#logout').click();
        cy.get('@signupButton').should('be.visible')
    })
    it('should display error for incorrect credentials', () => {
        cy.visit("/");

      cy.get("#email").type('wrongUsername');
      cy.get("#password").type('wrongPassword');
      cy.get("#submit").click();

      cy.get('#error').should('be.visible').and('contain', 'Incorrect username or password')
    })
})