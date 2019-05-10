/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import { addTodo, visit, selectors } from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  visit();
})

describe('todo mvc', () => {
  it('No todos', () => {
    /** When there are no todos, '#main' and '#footer' should be hidden. */
    cy.get('#main').should('not.be.visible');
    cy.get('#footer').should('not.be.visible');
  });

  it('New todo', () => {
    /** 
     * New todos are entered in the input at the top of the app. 
     * The input element should be focused when the page is loaded, preferably by using the 'autofocus' input attribute. 
     * Pressing Enter creates the todo, appends it to the todo list, and clears the input. 
     * Make sure to '.trim()' the input and then check that it's not empty before creating a new todo. 
     */

    cy.focused().should('have.class', selectors.newTodoInput.substr(1));

    cy.get(selectors.newTodoInput).type('Hello world  ').type('{enter}');
    cy.get(selectors.todoListItems).last().invoke('text').should('eq', 'Hello world');
  });

  it('Mark all as complete', () => {
    /** 
     * This checkbox toggles all the todos to the same state as itself. 
     * Make sure to clear the checked state after the "Clear completed" button is clicked. 
     * The "Mark all as complete" checkbox should also be updated when single todo items are checked/unchecked. Eg. When all the todos are checked it should also get checked.
     */

    // Initial state
    cy.get(selectors.toggleAllCheckbox).should('not.be.visible');

    // When nothing is checked 
    addTodo('Hello');
    addTodo('World');
    cy.get(selectors.toggleAllCheckbox).should('not.be.checked');

    // When there is a mix of checked and not checked items
    cy.get(selectors.itemCheckBoxByIndex(0)).click();
    cy.get(selectors.toggleAllCheckbox).should('not.be.checked');

    // When they are all checked
    cy.get(selectors.itemCheckBoxByIndex(1)).click();
    cy.get(selectors.toggleAllCheckbox).should('be.checked');

    // When toggle all is in checked state and clicked
    cy.get(selectors.toggleAllCheckbox).click();
    cy.get(selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
    cy.get(selectors.itemCheckBoxByIndex(1)).should('not.be.checked');
    cy.get(selectors.toggleAllCheckbox).should('not.be.checked');

    // When toggle all is not in checked state and clicked
    cy.get(selectors.toggleAllCheckbox).click();
    cy.get(selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(selectors.itemCheckBoxByIndex(1)).should('be.checked');
    cy.get(selectors.toggleAllCheckbox).should('be.checked');
  });

  it('Item', () => {
    /** 
     * A todo item has three possible interactions:
     * 1. Clicking the checkbox marks the todo as complete by updating its 'completed' value and toggling the class 'completed' on its parent '<li>'
     * 2. Clicking the remove button should remove it item
     */


    // Checked state
    addTodo('Hello World');
    cy.get(selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
    cy.get(selectors.itemCheckBoxByIndex(0)).click();
    cy.get(selectors.itemCheckBoxByIndex(0)).should('be.checked');


    // Destruction
    cy.get(selectors.itemDestroyByIndex(0)).invoke('show').click();
    cy.get('Hello World').should('not.exist');
  });

  it('Editing', () => {
    /** 
     * Double-clicking the '<label>' activates editing mode
     * 
     * The edit should be saved on both blur and enter, and the 'editing' class should be removed. 
     * 
     * Make sure to '.trim()' the input and then check that it's not empty. If it's empty the todo should instead be destroyed. 
     * 
     * If escape is pressed during the edit, the edit state should be left and any changes be discarded.
     */

    addTodo('Hello');

    /** Should enter and exit edit mode */
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).should('exist').blur().should('not.exist');

    /** Should commit on blur */
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).clear().type('World').blur();
    cy.get(selectors.itemLabelByIndex(0)).should('have.text', 'World');

    /** Should commit on enter */
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).clear().type('Again{enter}');
    cy.get(selectors.itemLabelByIndex(0)).should('have.text', 'Again');

    /** Should not commit on escape */
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).clear().type('Hello{enter}')
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).clear().type('Ignored{esc}');
    cy.get(selectors.itemLabelByIndex(0)).should('have.text', 'Hello');

    /** Should commit without spaces */
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).clear().type(' Hello ').blur();
    cy.get(selectors.itemLabelByIndex(0)).should('have.text', 'Hello');

    /** Should destroy on empty commit */
    cy.get(selectors.itemLabelByIndex(0)).dblclick();
    cy.get(selectors.itemEditByIndex(0)).clear().type('{enter}');
    cy.get(selectors.itemLabelByIndex(0)).should('not.exist');
  });

  it('Counter', () => {
    /** 
     * Displays the number of active todos in a pluralized form. Make sure to pluralize the 'item' word correctly: '0 items', '1 item', '2 items'. Example: **2** items left
     */
    addTodo('Hello World');
    cy.get(selectors.todoCount).should('have.text', '1 item left');

    addTodo('Again');
    cy.get(selectors.todoCount).should('have.text', '2 items left');

    cy.get(selectors.toggleAllCheckbox).click();
    cy.get(selectors.todoCount).should('have.text', '0 items left');
  });

  it.only('Clear completed button', () => {
    /** 
     * Should be hidden when there are no completed todos.
     * Removes completed todos when clicked. 
     */
    cy.get(selectors.clearCompleted).should('not.exist');
    addTodo('Again');
    cy.get(selectors.itemCheckBoxByIndex(0)).click();
    cy.get(selectors.clearCompleted).should('be.visible');
    
    cy.get(selectors.clearCompleted).click();
    cy.get(selectors.itemLabelByIndex(0)).should('not.exist');
  });
});

`

### Routing
Routing is required for all implementations. If supported by the framework, use its built-in capabilities. Otherwise, use the  [Flatiron Director](https://github.com/flatiron/director) routing library located in the '/assets' folder. The following routes should be implemented: '#/' (all - default), '#/active' and '#/completed' ('#!/' is also allowed). When the route changes, the todo list should be filtered on a model level and the 'selected' class on the filter links should be toggled. When an item is updated while in a filtered state, it should be updated accordingly. E.g. if the filter is 'Active' and the item is checked, it should be hidden. Make sure the active filter is persisted on reload.
`
