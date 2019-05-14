/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import * as page from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# Routing
The following routes should be implemented: 
- "#/" (default) - all items are shown. The all link is selected
- "#/active" - Only active items are shown. The active link is selected
- "#/completed" - Only completed items are shown. The completed link is selected

Live filtering:
- "#/active" - Items should move out if checked
- "#/completed" - Items should move out if unchecked
`

describe('Routing', () => {
  beforeEach(() => {
    page.addTodo('Completed');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    page.addTodo('InProgress');
  });
  it('"#/" (default) - all items are shown. The all link is selected', () => {
    cy.get(page.selectors.all).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['Completed', 'InProgress']);
  });
  it('"#/active" - Only active items are shown. The active link is selected', () => {
    cy.visit('#/active');
    cy.get(page.selectors.active).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['InProgress']);
  });
  it('"#/completed" - Only completed items are shown. The completed link is selected', () => {
    cy.visit('#/completed');
    cy.get(page.selectors.completed).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['Completed']);
  });
  it('"#/active" - Items should move out if checked', () => {
    cy.visit('#/active');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
  it('"#/completed" - Items should move out if unchecked', () => {
    cy.visit('#/completed');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
});
