export const getReactInitialStateAsync = () => window.ipcRenderer.invoke('get-react-initial-state');

export const getPasswordAsync = (service, account) => window.ipcRenderer.invoke('get-password', service, account);
export const deletePasswordAsync = (service, account) => window.ipcRenderer.invoke('delete-password', service, account);
export const setPasswordAsync = (service, account, password) => window.ipcRenderer.invoke('set-password', service, account, password);
