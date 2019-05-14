export const classNames = {
  newTodoInput: 'new-todo'
}

export const selectors = {
  newTodoInput: '.' + classNames.newTodoInput,
  toggleAllCheckbox: '.toggle-all',

  mainList: '#main',
  footer: '#footer',

  itemCheckBoxByIndex: (index: number) => `[data-test=item-toggle-${index}]`,
  itemLabelByIndex: (index: number) => `[data-test=item-label-${index}]`,
  itemDestroyByIndex: (index: number) => `[data-test=item-destroy-${index}]`,
  itemEditByIndex: (index: number) => `[data-test=item-edit-${index}]`,

  todoCount: '.todo-count',
  clearCompleted: '.clear-completed',
  todoListItems: '.todo-list label',

  all: '[data-test=all]',
  active: '[data-test=active]',
  completed: '[data-test=completed]',
}

export const visit = () => {
  cy.visit('http://localhost:8080');
}

export const addTodo = (text: string) => {
  cy.get(selectors.newTodoInput).type(text).type('{enter}');
}

export const getAllTodos = () => {
  return cy.get(selectors.todoListItems)
    .then($items => {
      const text: string[] = [];
      $items.each((_i, item) => {
        text.push(Cypress.$(item).text());
      });
      return text;
    });
}
