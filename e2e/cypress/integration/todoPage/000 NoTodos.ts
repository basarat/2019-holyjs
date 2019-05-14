/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# No todos
When there are no todos:
- The main list and the footer should be hidden.
`
describe('No todos', () => {
  it('The main list and footer should be hidden', () => {
    
  });
});
