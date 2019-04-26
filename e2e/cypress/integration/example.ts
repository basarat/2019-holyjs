/// <reference types="cypress"/>

import { startServer } from "../utils/server";

before(() => {
  startServer();
})

describe('Hello world suite', () => {
  it('Hello world test', () => {
    cy.visit('http://localhost:8080');
    cy.get('.new-todo').type('Hello{enter}');
    cy.get('.new-todo').type('World{enter}');
  })
})