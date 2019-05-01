import { observable, action, computed } from 'mobx';
import { FieldState } from 'formstate';
import { TodoItem } from '../../common/types';
import { getAll, create, setAll } from '../service/todoService';
import { routerState } from './routerState';


class AppState {
  constructor() {
    this.loadItems();
  }

  @observable
  items: TodoItem[] = [];

  @observable
  current = new FieldState('');

  @computed
  get hasTodos() {
    return this.items.length !== 0;
  }

  @computed
  get activeCount() {
    return this.items.filter(i => i.completed == false).length;
  }

  @computed
  get completedCount() {
    return this.items.filter(i => i.completed).length;
  }

  @computed
  get visibleList() {
    return routerState.route == 'all'
      ? this.items
      : routerState.route == 'active'
        ? this.items.filter(i => i.completed == false)
        : this.items.filter(i => i.completed == true)
  }

  @action
  async addCurrentItem() {
    if (this.current.value.trim() === '') return;
    const { id } = await create({ message: this.current.value.trim() });
    this.items.push({
      id,
      completed: false,
      message: this.current.value.trim()
    });
    this.current.onChange('');
  }

  @action
  async loadItems() {
    const { todos } = await getAll();
    this.items = todos;
  }

  @action
  async toggle(item: TodoItem) {
    item.completed = !item.completed;
    setAll({ todos: this.items });
  }

  @action
  async destroy(item: TodoItem) {
    this.items = this.items.filter(i => i.id !== item.id);
    setAll({ todos: this.items });
  }

  @action
  clearCompleted(): void {
    this.items = this.items.filter(i => i.completed == false);
    setAll({ todos: this.items });
  }

  @observable
  editingId: string | null = null;
  @observable
  editingTodoMessage: null | FieldState<string> = null;

  @action
  setEditing(item: TodoItem) {
    this.editingId = item.id;
    this.editingTodoMessage = new FieldState(item.message);
  }

  @action
  cancelEditing() {
    this.editingId = null;
    this.editingTodoMessage = null;
  }

  @action
  async submitEditing() {
    const todo = this.items.find(i => i.id === this.editingId);
    todo.message = this.editingTodoMessage.value.trim();
    setAll({ todos: this.items });
    this.cancelEditing();
  }
}

export const appState = new AppState();
