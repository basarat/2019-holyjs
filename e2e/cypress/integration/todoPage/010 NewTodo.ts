/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# New todo
- The input element should be focused when the page is loaded. 
- New todos are entered in the input at the top of the app. 
- Pressing Enter creates the todo, appends it to the todo list, and clears the input. 
- Make sure to '.trim()' the input and then check that it's not empty before creating a new todo. 
`

describe('New todo', () => {
  it('The input element should be focused when the page is loaded.', () => {
    
  });
  it('Create by enter, adds it to the list', () => {
    
  });
  it('Empty input after adding', () => {
    
  });
  it('Trim before adding', () => {
    
  });
  it('Don\'t create if empty', () => {
    
  });
});
