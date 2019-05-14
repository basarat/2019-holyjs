/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import * as page from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

describe('Example', () => {
  it('Should work', () => {
    page.addTodo('one');
    page.addTodo('two');

    cy.contains('one');
    cy.contains('two');
  });
});
