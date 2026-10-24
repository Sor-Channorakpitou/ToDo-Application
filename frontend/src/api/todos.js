import { apiClient } from './client';

function toBackendStatus(status) {
  if (status === 'To Do') return 'TODO';
  if (status === 'In Progress') return 'IN_PROGRESS';
  if (status === 'Done') return 'DONE';
  return 'TODO';
}

function toFrontendStatus(status) {
  if (status === 'TODO') return 'To Do';
  if (status === 'IN_PROGRESS') return 'In Progress';
  if (status === 'DONE') return 'Done';
  return 'To Do';
}

export async function getTodos() {
  try {
    const response = await apiClient.get('/todos');
    return response.data.map((todo) => ({
      id: todo.id,
      title: todo.title,
      status: toFrontendStatus(todo.status),
    }));
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not load todos';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
  }
}

export async function createTodo(title, status) {
  try {
    const response = await apiClient.post('/todos', {
      title,
      status: toBackendStatus(status),
    });
    const todo = response.data;
    return {
      id: todo.id,
      title: todo.title,
      status: toFrontendStatus(todo.status),
    };
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not create todo';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
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
    const res = await apiClient.patch(`/todos/${id}`, body);
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not update todo';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
  }
}

export async function deleteTodo(id) {
  try {
    await apiClient.delete(`/todos/${id}`);
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not delete todo';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
  }
}
