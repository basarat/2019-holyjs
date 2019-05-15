/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# Toggle all
- Should not be visible when there are no todos.
- If any todo is not complete it should not be checked.
- When all the todos are checked it should also get checked.

This checkbox toggles all the todos to the same state as itself. 
- When clicked, If it is not checked, it checks all todos.
- When clicked, If it is checked, it unchecks all todos.
`
describe('Toggle all', () => {
  it('should not be visible when there are no todos', () => {
    
  });
  it('If any todo is not complete it should not be checked.', () => {
    
  });
  it('When all the todos are checked it should also get checked.', () => {
    
  });
  it('This checkbox toggles all the todos to the same state as itself', () => {
    
  });
});
