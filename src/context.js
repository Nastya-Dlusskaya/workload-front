export const BACK_END_SERVER_URL = "http://localhost:8888";

export const LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN = "access_token";
export const LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN = "refresh_token";
export const LOCAL_STORAGE_USER_DATA = "user_data";

export const OAUTH2_GRANT_TYPE_PASSWORD = "password";
export const OAUTH2_GRANT_TYPE_REFRESH_TOKEN = "refresh_token";
export const OAUTH2_CLIENT_ID = "workload-client";
export const OAUTH2_CLIENT_SECRET = "workload-secret";

export const ROLE_LECTURER = "LECTURER";
export const ROLE_ADMIN = "ADMIN";

export const USER_AVATAR_DEFAULT = "/img/user_ava.jpeg";

export let isHasRole = (role) => {
  let user = localStorage.getItem(LOCAL_STORAGE_USER_DATA);
  if (user) {
    let roles = JSON.parse(user).authorities;
    if (roles && roles.includes(role)) {
      return true;
    }
  }
  return false;
};

export let getUserId = () => {
  let user = localStorage.getItem(LOCAL_STORAGE_USER_DATA);
  if (user) {
    return JSON.parse(user).id;
  }
  return null;
};

export let getPopupTitle = (id) => {
  return id !== null ? "Редактировать " : "Добавить ";
};