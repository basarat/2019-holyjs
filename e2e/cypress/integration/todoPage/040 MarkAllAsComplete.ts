/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# Make all as complete
- Should not be visible when there are no todos.
- If any todo is not complete it should not be checked.
- When all the todos are checked it should also get checked.

This checkbox toggles all the todos to the same state as itself. 
- When clicked, If it is not checked, it checks all todos.
- When clicked, If it is checked, it unchecks all todos.
`
describe('Mark all as complete', () => {
  it('should not be visible when there are no todos', () => {
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.visible');
  });
  it('If any todo is not complete it should not be checked.', () => {
    page.addTodo('Hello');
    page.addTodo('World');
    /** When nothing is checked */
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
    /** When mixed */
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
  });
  it('When all the todos are checked it should also get checked.', () => {
    page.addTodo('Hello');
    page.addTodo('World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(1)).click();
    cy.get(page.selectors.toggleAllCheckbox).should('be.checked');
  });
  it('This checkbox toggles all the todos to the same state as itself', () => {
    page.addTodo('Hello');
    page.addTodo('World');

    /** When clicked, If it is not checked, it checks all todos. */
    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(1)).should('be.checked');
    cy.get(page.selectors.toggleAllCheckbox).should('be.checked');

    /** When clicked, If it is checked, it unchecks all todos. */
    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(1)).should('not.be.checked');
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
  });
});
