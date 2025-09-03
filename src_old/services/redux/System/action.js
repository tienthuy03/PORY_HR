export const SET_RECEIVE_NOTIFICATION = 'SET_RECEIVE_NOTIFICATION';
export const LOAD_RECEIVE_NOTIFICATION = 'LOAD_RECEIVE_NOTIFICATION';
export const GET_DATA_RECEIVE_NOTIFICATION = 'GET_DATA_RECEIVE_NOTIFICATION';

export const SetReveiceNotification = (recieveNotification) => {
  return {
    type: SET_RECEIVE_NOTIFICATION,
    recieveNotification,
  };
};

export const LoadReveiceNotification = (recieveNotification) => {
  return {
    type: LOAD_RECEIVE_NOTIFICATION,
    recieveNotification,
  };
};

export const GetDataReceiceNotification = () => {
  return {
    type: GET_DATA_RECEIVE_NOTIFICATION,
  };
};

export const SYS_LOAD_THEME = 'SYS_LOAD_THEME';
export const sysLoadTheme = (theme) => {
  return {
    type: SYS_LOAD_THEME,
    theme,
  };
};
