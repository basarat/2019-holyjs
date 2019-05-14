/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import * as page from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# Clear completed button
- Should be hidden when there are no completed todos
- Should be visible when there are completed todos
- Clicking it removes completed todos 
`
describe('Clear completed button', () => {
  it('Should be hidden when there are no completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.clearCompleted).should('not.exist');
  });
  it('Should be visible when there are no completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.clearCompleted).should('exist');
  });
  it('Clicking it removes completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.clearCompleted).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
});
