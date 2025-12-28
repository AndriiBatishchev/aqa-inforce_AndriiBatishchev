import {
  getBookingDates,
  formatDateForBooking,
} from './utils/dateUtils'

import { adminLogin } from './api'

Cypress.Commands.add('selectRoom', (roomName) => {

  cy.contains('.card-title', roomName)
    .parents('.room-card')
    .within(() => {
      cy.contains('Book now').click()
    })
})

Cypress.Commands.add('selectDates', (checkIn, checkOut) => {
  cy.get('.react-datepicker__input-container input')
    .eq(0)
    .should('be.visible')
    .clear()
    .type(formatDateForBooking(checkIn))
    .blur()

  cy.get('.react-datepicker__input-container input')
    .eq(1)
    .should('be.visible')
    .clear()
    .type(formatDateForBooking(checkOut))
    .blur()
})


Cypress.Commands.add('adminLogin', () => {
  cy.visit('/admin')

  cy.get('[type="text"]').type('admin')
  cy.get('[type="password"]').type('password')
  cy.contains('button', 'Login').click()

  cy.contains('Rooms').should('be.visible')
})
