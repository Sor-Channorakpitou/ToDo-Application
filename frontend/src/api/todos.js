import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/todos',
});

function toBackendStatus(status) {
  if (status === 'To Do') return 'TODO';
  if (status === 'In Progress') return 'IN_PROGRESS';
  if (status === 'Done') return 'DONE';
}

function toFrontendStatus(status) {
  if (status === 'TODO') return 'To Do';
  if (status === 'IN_PROGRESS') return 'In Progress';
  if (status === 'DONE') return 'Done';
}

export async function getTodos() {
  try {
    const response = await api.get('');

    return response.data.map(function (todo) {
      return {
        id: todo.id,
        title: todo.title,
        status: toFrontendStatus(todo.status),
      };
    });
  } catch {
    throw new Error('Could not load todos');
  }
}

export async function createTodo(title, status) {
  try {
    const response = await api.post('', {
      title: title,
      status: toBackendStatus(status),
    });

    const todo = response.data;

    return {
      id: todo.id,
      title: todo.title,
      status: toFrontendStatus(todo.status),
    };
  } catch {
    throw new Error('Could not create todo');
  }
}

export async function updateTodo(id, changes) {
  const body = {};

  if (changes.title !== undefined) {
    body.title = changes.title;
  }
  if (changes.status !== undefined) {
    body.status = toBackendStatus(changes.status);
  }

  try {
    await api.patch('/' + id, body);
  } catch {
    throw new Error('Could not update todo');
  }
}

export async function deleteTodo(id) {
  try {
    await api.delete('/' + id);
  } catch {
    throw new Error('Could not delete todo');
  }
}
