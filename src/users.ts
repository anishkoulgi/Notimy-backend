const users = [];

export const addUser = ({ id, userId }) => {
  const existingUser = users.find((user) => user.userId === userId);

  if (existingUser) return { error: 'Username is taken.' };

  const user = { id, userId };

  users.push(user);
  return { user };
};

export const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

export const getUser = (id) => users.find((user) => user.id === id);

export const getUsers = () => users;
