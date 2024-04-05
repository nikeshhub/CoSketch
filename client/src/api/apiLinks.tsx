// api/users.js

const BASE_URL = "http://localhost:8000";

export const USER_SIGNUP_ENDPOINT = `${BASE_URL}/user/sign-up`;
export const USER_VERiFY_ENDPOINT = `${BASE_URL}/user/verify`;
export const USER_SIGNIN_ENDPOINT = `${BASE_URL}/user/sign-in`;
export const SESSION_CREATE_ENDPOINT = `${BASE_URL}/session`;
export const SESSION_GET_ENDPOINT = (id: string) => {
  return `${BASE_URL}/session/${id}`;
};
export const SESSION_DELETE_ENDPOINT = (id: string) => {
  return `${BASE_URL}/session/${id}`;
};
