/// <reference types="cypress"/>

describe('Hello world', () => {
  it('should visit google.com', () => {
    cy.visit('http://www.google.com')
  })
})