import { apiClient } from './client';

export async function getAllUsersApi() {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not fetch users';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
  }
}

export async function updateUserApi(id, updates) {
  try {
    const response = await apiClient.patch(`/users/${id}`, updates);
    return response.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not update user';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
  }
}

export async function deleteUserApi(id) {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || 'Could not delete user';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg, { cause: err });
  }
}
