export const SET_API_URL = 'SET_API_URL';
export const CONFIG_API_URL = 'CONFIG_API_URL';
export const SetApiURL = (URL) => {
  return {
    type: SET_API_URL,
    URL,
  };
};
export const ConfigApiURL = () => {
  return {
    type: CONFIG_API_URL,
  };
};
