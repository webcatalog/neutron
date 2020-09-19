const isRegExp = (str) => {
  try {
    new RegExp(`^${str}$`, 'i'); // eslint-disable-line
    return true;
  } catch {
    return false;
  }
};

export default isRegExp;
