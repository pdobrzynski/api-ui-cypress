let authToken: string; 
let contactID: string;

describe('Contact List test suite', () => {
    beforeEach(function () {
        cy.intercept("POST", "/users/login").as("loginUser");
        
        cy.fixture('contacts').then((contact) => {
            this.contact = contact
        })
        cy.login(Cypress.env('email'), Cypress.env('password'))
        cy.wait('@loginUser').then((intercept) => {
            // Access the token from the login request
            authToken = intercept.response?.body.token;
          });
    })

    it('should validate data from existing contact', function () {
        const existingContact = this.contact.contacts[0]
        cy.get('#myTable').within(() => {
            cy.get('td').eq(1).should('have.text', `${existingContact.firstName} ${existingContact.lastName}`)
            cy.get('td').eq(2).should('have.text', `${existingContact.birthdate}`)
            cy.get('td').eq(3).should('have.text', `${existingContact.email}`)
            cy.get('td').eq(4).should('have.text', `${existingContact.phone}`)
            cy.get('td').eq(5).should('have.text', `${existingContact.street1} ${existingContact.street2}`)
            cy.get('td').eq(6).should('have.text', `${existingContact.city} ${existingContact.stateProvince} ${existingContact.postalCode}`)
            cy.get('td').eq(7).should('have.text', `${existingContact.country}`)
        })
    })

    it('should validate data from contact details', function () {
        const existingContact = this.contact.contacts[0]
        cy.contains(existingContact.firstName).should('be.visible').click();
        cy.location("pathname").should("equal", "/contactDetails");
        cy.get('form').within(() => {
            cy.get('p').find('span').eq(0).should('have.text', `${existingContact.firstName}`)
            cy.get('p').find('span').eq(1).should('have.text', `${existingContact.lastName}`)
            cy.get('p').find('span').eq(2).should('have.text', `${existingContact.birthdate}`)
            cy.get('p').find('span').eq(3).should('have.text', `${existingContact.email}`)
            cy.get('p').find('span').eq(4).should('have.text', `${existingContact.phone}`)
            cy.get('p').find('span').eq(5).should('have.text', `${existingContact.street1}`)
            cy.get('p').find('span').eq(6).should('have.text', `${existingContact.street2}`)
            cy.get('p').find('span').eq(7).should('have.text', `${existingContact.city}`)
            cy.get('p').find('span').eq(8).should('have.text', `${existingContact.stateProvince}`)
            cy.get('p').find('span').eq(9).should('have.text', `${existingContact.postalCode}`)
            cy.get('p').find('span').eq(10).should('have.text', `${existingContact.country}`)
        })
    })

    it('should add new contact', function () {
        cy.intercept('POST', '/contacts').as('contactId')
        const newContact = this.contact.contacts[2]
        cy.get('#add-contact').click()

        // add contact
        cy.get('form').within(() => {
            cy.get('#firstName').type(newContact.firstName)
            cy.get('#lastName').type(newContact.lastName)
            cy.get('#birthdate').type(newContact.birthdate)
            cy.get('#email').type(newContact.email)
            cy.get('#phone').type(newContact.phone)
            cy.get('#street1').type(newContact.street1)
            cy.get('#street2').type(newContact.street2)
            cy.get('#city').type(newContact.city)
            cy.get('#stateProvince').type(newContact.stateProvince)
            cy.get('#postalCode').type(newContact.postalCode)
            cy.get('#country').type(newContact.country)
            cy.root().submit()
        })

        // assert new contact
        cy.contains(newContact.firstName).should('be.visible').click();
        cy.get('form').within(() => {
            cy.get('p').find('span').eq(0).should('have.text', `${newContact.firstName}`)
            cy.get('p').find('span').eq(1).should('have.text', `${newContact.lastName}`)
            cy.get('p').find('span').eq(2).should('have.text', `${newContact.birthdate}`)
            cy.get('p').find('span').eq(3).should('have.text', `${newContact.email}`)
            cy.get('p').find('span').eq(4).should('have.text', `${newContact.phone}`)
            cy.get('p').find('span').eq(5).should('have.text', `${newContact.street1}`)
            cy.get('p').find('span').eq(6).should('have.text', `${newContact.street2}`)
            cy.get('p').find('span').eq(7).should('have.text', `${newContact.city}`)
            cy.get('p').find('span').eq(8).should('have.text', `${newContact.stateProvince}`)
            cy.get('p').find('span').eq(9).should('have.text', `${newContact.postalCode}`)
            cy.get('p').find('span').eq(10).should('have.text', `${newContact.country}`)
        })

        // cleanup - delete contact
        cy.wait('@contactId').then((intercept) => {
            expect(intercept.response?.statusCode).to.eq(201);
            contactID = intercept.response?.body._id
            cleanUp()
        })
        
    })

    function cleanUp() {
        cy.httpRequest('DELETE', `${Cypress.config().baseUrl}/contacts/${contactID}`, authToken)
            .then((response) => {
                expect(response.status).to.eq(200)
        })    
    }
})