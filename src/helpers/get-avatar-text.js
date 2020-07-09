const getAvatarText = (id, name, order) => {
  if (id === 'add') return '+';
  if (name) return name[0];
  if (typeof order === 'number') return order + 1;
  return '*';
};

export default getAvatarText;
