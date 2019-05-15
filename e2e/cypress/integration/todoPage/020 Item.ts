/// <reference types="cypress"/>

import { startServer } from "../../utils/server";
import * as page from "../../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# Item
- Starts off unchecked
- Clicking the checkbox toggles the todo active/complete
- Clicking the remove button should remove it item
`

describe('Item', () => {
  it('Starts off unchecked', () => {
  
  });
  it('Clicking the checkbox toggles the todo active/complete', () => {
    
  });
  it('Clicking the remove button should remove it item', () => {
    
  });
});
