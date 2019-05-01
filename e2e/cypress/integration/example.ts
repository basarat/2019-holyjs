/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import { addTodo, visit } from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
})

describe('Hello world suite', () => {
  it('Hello world test', () => {
    visit();
    addTodo('one');
    addTodo('two');
    
    cy.contains('one');
    cy.contains('two');
  })
});

`

`
