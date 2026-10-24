import { apiClient, tokenStorage } from './client';

export async function loginApi({ email, password }) {
  const response = await apiClient.post('/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  });

  const { accessToken } = response.data;
  if (accessToken) {
    tokenStorage.set(accessToken);
  }

  const user = await getMeApi();
  return { accessToken, user };
}

export async function signupApi({ email, password }) {
  const response = await apiClient.post('/auth/signup', {
    email: email.trim().toLowerCase(),
    password,
  });
  return response.data;
}

export async function logoutApi() {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore error on logout if already expired
  } finally {
    tokenStorage.clear();
  }
}

export async function getMeApi() {
  const response = await apiClient.get('/users/me');
  return response.data;
}

export async function refreshApi() {
  const response = await apiClient.post('/auth/refresh');
  const { accessToken } = response.data;
  if (accessToken) {
    tokenStorage.set(accessToken);
  }
  return accessToken;
}
