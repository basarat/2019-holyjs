/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import { addTodo } from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
})

describe('Hello world suite', () => {
  it('Hello world test', () => {
    cy.visit('http://localhost:8080');
    addTodo('one');
    addTodo('two');
    cy.contains('one');
    cy.contains('two');
  })
})