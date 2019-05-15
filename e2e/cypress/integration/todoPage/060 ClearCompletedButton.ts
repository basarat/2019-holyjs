/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

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
    
  });
  it('Should be visible when there are completed todos', () => {
    
  });
  it('Clicking it removes completed todos', () => {
    
  });
});
