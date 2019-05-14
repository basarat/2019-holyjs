/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# New todo
- The input element should be focused when the page is loaded
- Created by enter, adding it to the list
- Clear input after adding
- '.trim()' the input before adding
- Do not create a todo if the result of trim is an empty string
`

describe('New todo', () => {
  it('The input element should be focused when the page is loaded', () => {

  });
  it('Created by enter, adding it to the list', () => {
  
  });
  it('Clear input after adding', () => {
  
  });
  it('`.trim` before adding', () => {
  
  });
  it('Do not create a todo if the result of trim is an empty string', () => {
  
  });
});
