/// <reference types="cypress"/>

import { startServer } from "../utils/server";
import * as page from "../utils/pages/todoPage";

beforeEach(() => {
  startServer();
  page.visit();
});

`
# No todos
- When there are no todos, the main list and the footer should be hidden.
`
describe('No todos', () => {
  it('The main list and footer should be hidden', () => {
    cy.get('#main').should('not.be.visible');
    cy.get('#footer').should('not.be.visible');
  });
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
    cy.focused().should('have.class', page.selectors.newTodoInput.substr(1));
  });
  it('Create by enter, adds it to the list', () => {
    cy.get(page.selectors.newTodoInput).type('Hello world').type('{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello world');
  });
  it('Empty input after adding', () => {
    cy.get(page.selectors.newTodoInput).type('Hello world').type('{enter}');
    cy.get(page.selectors.newTodoInput).should('have.text', '');
  });
  it('Trim before adding', () => {
    cy.get(page.selectors.newTodoInput).type(' Hello world ').type('{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello world');
  });
  it('Don\'t create if empty', () => {
    cy.get(page.selectors.newTodoInput).type('  ').type('{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
});

`
# Make all as complete
- Should not be visible when there are no todos.
- If any todo is not complete it should not be checked.
- When all the todos are checked it should also get checked.

This checkbox toggles all the todos to the same state as itself. 
- When clicked, If it is not checked, it checks all todos.
- When clicked, If it is checked, it unchecks all todos.
`
describe('Mark all as complete', () => {
  it('should not be visible when there are no todos', () => {
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.visible');
  });
  it('If any todo is not complete it should not be checked.', () => {
    page.addTodo('Hello');
    page.addTodo('World');
    /** When nothing is checked */
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
    /** When mixed */
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
  });
  it('When all the todos are checked it should also get checked.', () => {
    page.addTodo('Hello');
    page.addTodo('World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(1)).click();
    cy.get(page.selectors.toggleAllCheckbox).should('be.checked');
  });
  it('This checkbox toggles all the todos to the same state as itself', () => {
    page.addTodo('Hello');
    page.addTodo('World');

    /** When clicked, If it is not checked, it checks all todos. */
    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(1)).should('be.checked');
    cy.get(page.selectors.toggleAllCheckbox).should('be.checked');

    /** When clicked, If it is checked, it unchecks all todos. */
    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(1)).should('not.be.checked');
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
  });
});

`
# Item
- Starts of unchecked
- Clicking the checkbox toggles the todo active/complete
- Clicking the remove button should remove it item
`

describe('Item', () => {
  it('Starts of unchecked', () => {
    page.addTodo('Hello World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
  });
  it('Clicking the checkbox toggles the todo active/complete', () => {
    page.addTodo('Hello World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
  });
  it('Clicking the remove button should remove it item', () => {
    page.addTodo('Hello world');
    cy.get(page.selectors.itemDestroyByIndex(0)).invoke('show').click();
    cy.get('Hello World').should('not.exist');
  });
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
  it('Double-clicking the todo label activates editing mode', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).should('exist');
  });
  it('The edit mode should exit on enter, blur and escape', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type('{enter}').should('not.exist');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).blur().should('not.exist');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type('{esc}').should('not.exist');
  });
  it('Enter results in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('Blur results in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World').blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('The *commit* is done after trim', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World ').blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('If the trim results in an empty value, the commit should destroy the item', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).clear().blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
  it('Escape does not result in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World{esc}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello');
  });
});

`
# Counter
- Is not displayed when there are no items
- Displays the number of active todos in a pluralized form e.g. "0 items left", "1 item left", "2 items left"
`
describe('Counter', () => {
  it('Is not displayed when there are no items', () => {
    cy.get(page.selectors.todoCount).should('not.exist');
  });
  it('Displays the number of active todos in a pluralized form e.g. "0 items left", "1 item left", "2 items left"', () => {
    page.addTodo('Hello World');
    cy.get(page.selectors.todoCount).should('have.text', '1 item left');

    page.addTodo('Again');
    cy.get(page.selectors.todoCount).should('have.text', '2 items left');

    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.todoCount).should('have.text', '0 items left');
  });
});

`
# Clear completed button
- Should be hidden when there are no completed todos
- Should be visible when there are completed todos
- Clicking it removes completed todos 
`
describe.only('Clear completed button', () => {
  it('Should be hidden when there are no completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.clearCompleted).should('not.exist');
  });
  it('Should be visible when there are no completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.clearCompleted).should('exist');
  });
  it('Clicking it removes completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.clearCompleted).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
});


describe('todo mvc', () => {
  it('Routing', () => {
    /** 
     * The following routes should be implemented: 
     * '#/' (all - default), '#/active' and '#/completed'. 
     * 
     * When the route changes, the todo list should be filtered on a model level and the 'selected' class on the filter links should be toggled.
     * 
     * When an item is updated while in a filtered state, it should be updated accordingly. E.g. if the filter is 'Active' and the item is checked, it should be hidden.  
     */
    page.addTodo('Completed');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    page.addTodo('InProgress');


    /** All */
    cy.get(page.selectors.all).should('have.class', 'selected');

    /** Active */
    cy.visit('#/active');
    cy.get(page.selectors.active).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['InProgress']);

    /** Completed */
    cy.visit('#/completed');
    cy.get(page.selectors.completed).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['Completed']);

    /** Should disappear if no longer matches active filter */
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
});
