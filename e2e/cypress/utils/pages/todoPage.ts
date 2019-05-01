export const selectors = {
  newTodoInput: '.new-todo',
  todoListItems: '.todo-list label',
  toggleAllCheckbox: '.toggle-all',
  itemCheckBoxByIndex: (index: number) => `[data-test=item-toggle-${index}]`,
  itemLabelByIndex: (index: number) => `[data-test=item-label-${index}]`,

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
