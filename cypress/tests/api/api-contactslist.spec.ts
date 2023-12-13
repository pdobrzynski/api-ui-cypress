const apiContacts = `${Cypress.config().baseUrl}/contacts`;
let contactId: any;

describe("Contacts API", function () {

    const email = Cypress.env('email');
    const password = Cypress.env('password');

    beforeEach(function () {
        cy.loginViaApi(email, password)
        cy.fixture('contacts').then((contact) => {
            this.contact = contact
        })
    })

    context("POST /contacts", function () {
        it("add contact to list", function () {
            cy.request({
                method: 'POST',
                auth: {
                    'bearer': Cypress.env('token'),
                },
                body: this.contact.contacts[0],
                url: apiContacts,
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body).to.have.property('_id').to.not.be.null;
                contactId = response.body._id  
            })
        })
    })

    context("GET /contacts", function () {
        it("gets list of all contacts", function () {
            cy.request({
                method: 'GET',
                auth: {
                    'bearer': Cypress.env('token'),
                },
                url: apiContacts,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array')
            })
        })
    })

    context("GET /contacts:contactId", function () {
        it("gets contact from the list", function () {
            cy.request({
                method: 'GET',
                auth: {
                    'bearer': Cypress.env('token'),
                },
                url: `${apiContacts}/${contactId}`,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body._id).to.eq(contactId);
                expect(response.body.__v).to.be.a('number')
            })
        })
        it("error when invalid contactId sent", function () {
            cy.request({
                method: 'GET',
                auth: {
                    'bearer': Cypress.env('token'),
                },
                failOnStatusCode: false,
                url: `${apiContacts}/1`,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.eq("Invalid Contact ID");
            })
        })
    })

    context("PATCH /contacts:contactId", function () {
        it('updates a contact', function () {
            cy.request({
                method: 'PATCH',
                auth: {
                    'bearer': Cypress.env('token'),
                },
                body: {
                    firstName: this.contact.contacts[1].firstName
                },
                url: `${apiContacts}/${contactId}`,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.firstName).to.eq(this.contact.contacts[1].firstName)
            })
        })
    })

    context("DELETE /contacts:contactId", function () {
        it("deletes contact from list", function () {
            cy.request({
                method: 'DELETE',
                auth: {
                    'bearer': Cypress.env('token'),
                },
                url: `${apiContacts}/${contactId}`,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.eq('Contact deleted')
            })
        })
    })

    after(function () {
        cy.logoutViaApi(Cypress.env('token'))
    })
})