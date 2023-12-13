import { faker } from "@faker-js/faker";

const apiUsers = `${Cypress.config().baseUrl}/users/me`;

describe('Users API', function () {

    const email = Cypress.env('email');
    const password = Cypress.env('password');

    beforeEach(function () {
        cy.loginViaApi(email, password)
    })

    context('GET /users/me', function () {
        it('returns user info', function () {
            cy.request({
                method: 'GET',
                url: apiUsers,
                auth: {
                    'bearer': Cypress.env('token')
                }
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('firstName').to.eq(Cypress.env('firstName'))
                expect(response.body).to.have.property('lastName').to.eq(Cypress.env('lastName'))
                expect(response.body).to.have.property('email').to.eq('riadteddy@gmail.com')
            })
        })
    })

    context('PATCH /users/me', function () {
        it('updates user info', function () {
            cy.request({
                method: 'PATCH',
                url: apiUsers,
                auth: {
                    'bearer': Cypress.env('token')
                },
                body: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                },
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('firstName').to.not.eq('teddy')
                expect(response.body).to.have.property('lastName').to.not.eq('test')
                expect(response.body).to.have.property('email').to.eq('riadteddy@gmail.com')
            })
        })
    })

    after('Cleanup', function () {
        cy.httpRequest('PATCH', apiUsers, Cypress.env('token'), { firstName: Cypress.env('firstName'), lastName: Cypress.env('lastName')})
            .then((response) => {
                expect(response.status).to.eq(200)
        })    
    })
})
