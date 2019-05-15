/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

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
  beforeEach(() => {
    page.addTodo('Hello');
  });
  it('Double-clicking the todo label activates editing mode', () => {
    
  });
  it('The edit mode should exit on enter, blur and escape', () => {
    
  });
  it('Enter results in a commit', () => {
    
  });
  it('Blur results in a commit', () => {
    
  });
  it('The *commit* is done after trim', () => {
    
  });
  it('If the trim results in an empty value, the commit should destroy the item', () => {
    
  });
  it('Escape does not result in a commit', () => {
    
  });
});
