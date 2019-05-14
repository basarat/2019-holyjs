/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import * as page from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# Edit item
- Double-clicking the todo label activates editing mode
- The edit mode should exit on enter, blur and escape
- Enter results in a commit
- Blur results in a commit
- The *commit* is done after trim
- If the trim results in an empty value, the commit should destroy the item
- Escape does not result in a commit
`
describe('Edit item', () => {
  it('Double-clicking the todo label activates editing mode', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).should('exist');
  });
  it('The edit mode should exit on enter, blur and escape', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type('{enter}').should('not.exist');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).blur().should('not.exist');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type('{esc}').should('not.exist');
  });
  it('Enter results in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('Blur results in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World').blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('The *commit* is done after trim', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World ').blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('If the trim results in an empty value, the commit should destroy the item', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).clear().blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
  it('Escape does not result in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World{esc}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello');
  });
});
