/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

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
    page.addTodo('Active');
  });
  it('"#/" (default) - all items are shown. The all link is selected', () => {
    
  });
  it('"#/active" - Only active items are shown. The active link is selected', () => {
    
  });
  it('"#/completed" - Only completed items are shown. The completed link is selected', () => {
    
  });
  it('"#/active" - Items should move out if checked', () => {
    
  });
  it('"#/completed" - Items should move out if unchecked', () => {
    
  });
});
