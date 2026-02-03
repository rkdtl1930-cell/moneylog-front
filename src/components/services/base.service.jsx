import useUserStore from '../store/useUserStore';

const authHeader = () => {
  const currentUser = useUserStore.getState().user;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (currentUser && currentUser.token) {
    headers.Authorization = 'Bearer ' + currentUser.token;
  }

  return headers;
};

export { authHeader };
