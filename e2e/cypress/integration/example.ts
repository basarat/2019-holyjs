/// <reference types="cypress"/>

import { startServer } from "../utils/server";

beforeEach(() => {
  startServer();
})

describe('Hello world suite', () => {
  it('Hello world test', () => {
    cy.visit('http://localhost:8080');
  })
})