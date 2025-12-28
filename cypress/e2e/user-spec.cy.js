import { getBookingDates, formatDateForConfirmation } from "../support/utils/dateUtils"

describe('Smoke Test - Home Page', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.contains('Welcome to Shady Meadows B&B').should('be.visible')

        const dates = getBookingDates()
        cy.wrap(dates).as('dates')

        cy.selectDates(dates.checkIn, dates.checkOut)
        cy.contains('button', 'Check Availability').click()
        cy.selectRoom('Suite')
    })

    it('room can be booked with valid data', function () {
        const { checkIn, checkOut } = this.dates

        const expectedText = `${formatDateForConfirmation(checkIn)} - ` + `${formatDateForConfirmation(checkOut)}`

        cy.contains('Reserve Now').click()

        cy.get('[name="firstname"]').type('Test')
        cy.get('[name="lastname"]').type('Testovich')
        cy.get('[name="email"]').type('test@test.com')
        cy.get('[name="phone"]').type('380999999999')

        cy.contains('Reserve Now').click()

        // Checking successful booking
        cy.contains('Booking Confirmed')
            .should('be.visible')

        cy.get('.card-body')
            .contains('Booking Confirmed')
            .parent()
            .within(() => {
                cy.get('strong').should('have.text', expectedText)
            })
    })

    context('room can not be booked with invalid data', () => {
        it('Empty fields validation', () => {
            cy.contains('Reserve Now').click()
            cy.contains('Reserve Now').click()

            cy.contains('Firstname should not be blank').should('be.visible')
            cy.contains('Lastname should not be blank').should('be.visible')
            cy.contains('must not be empty').should('be.visible')
        })
        it('Empty/incorrect Firstname', () => {
            cy.contains('Reserve Now').click()

            // User Data
            //cy.get('[name="firstname"]').type('Test')
            cy.get('[name="lastname"]').type('Testovich')
            cy.get('[name="email"]').type('test@test.com')
            cy.get('[name="phone"]').type('380999999999')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 3 and 18').should('be.visible')
            cy.contains('Firstname should not be blank').should('be.visible')

            cy.get('[name="firstname"]').type('te')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 3 and 18').should('be.visible')

            cy.get('[name="firstname"]').type('testtesttesttesttest')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 3 and 18').should('be.visible')
        })
        it('Empty/incorrect Lastname', () => {
            cy.contains('Reserve Now').click()

            // User Data
            cy.get('[name="firstname"]').type('Test')
            //cy.get('[name="lastname"]').type('Testovich')
            cy.get('[name="email"]').type('test@test.com')
            cy.get('[name="phone"]').type('380999999999')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 3 and 30').should('be.visible')
            cy.contains('Lastname should not be blank').should('be.visible')

            cy.get('[name="lastname"]').type('te')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 3 and 30').should('be.visible')
            cy.get('[name="lastname"]').type('testtesttesttesttesttesttesttest')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 3 and 30').should('be.visible')
        })
        it('Empty/incorrect email', () => {
            cy.contains('Reserve Now').click()

            // User Data
            cy.get('[name="firstname"]').type('Test')
            cy.get('[name="lastname"]').type('Testovich')
            //cy.get('[name="email"]').type('test@test.com')
            cy.get('[name="phone"]').type('380999999999')
            cy.contains('Reserve Now').click()

            cy.contains('must not be empty').should('be.visible')

            cy.get('[name="email"]').type('test')
            cy.contains('Reserve Now').click()
            cy.contains('must be a well-formed email address').should('be.visible')

            cy.get('[name="email"]').type('test@')
            cy.contains('Reserve Now').click()
            cy.contains('must be a well-formed email address').should('be.visible')

        })
        it('Empty/incorrect phone', () => {
            cy.contains('Reserve Now').click()

            // User Data
            cy.get('[name="firstname"]').type('Test')
            cy.get('[name="lastname"]').type('Testovich')
            cy.get('[name="email"]').type('test@test.com')
            //cy.get('[name="phone"]').type('380999999999')
            cy.contains('Reserve Now').click()

            cy.contains('must not be empty').should('be.visible')
            cy.contains('size must be between 11 and 21').should('be.visible')

            cy.get('[name="phone"]').type('3809')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 11 and 21').should('be.visible')

            cy.get('[name="phone"]').type('380999938099993809999')
            cy.contains('Reserve Now').click()

            cy.contains('size must be between 11 and 21').should('be.visible')
        })
    })

    it('earlier booked dates show as Unavailable', function () {
        const { checkIn, checkOut } = this.dates
        const expectedText = `${formatDateForConfirmation(checkIn)} - ` + `${formatDateForConfirmation(checkOut)}`

        cy.contains('Reserve Now').click()

        cy.get('[name="firstname"]').type('Test')
        cy.get('[name="lastname"]').type('Testovich')
        cy.get('[name="email"]').type('test@test.com')
        cy.get('[name="phone"]').type('380999999999')

        cy.contains('Reserve Now').click()

        // Checking successful booking
        cy.contains('Booking Confirmed')
            .should('be.visible')

        cy.get('.card-body')
            .contains('Booking Confirmed')
            .parent()
            .within(() => {
                cy.get('strong').should('have.text', expectedText)
            })

        cy.contains('Booking').click()
        cy.contains('Welcome to Shady Meadows B&B').should('be.visible')

        //cy.selectRoom('Single')
        //cy.selectRoom('Double')
        cy.selectRoom('Suite')

        cy.contains('Book This Room').should('be.visible')

        cy.get('.rbc-event-content')
            .contains('Unavailable')
            .should('be.visible')
    })
})


