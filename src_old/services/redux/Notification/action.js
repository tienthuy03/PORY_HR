export const NT_GET_NOTIFICATION = 'NT_GET_NOTIFICATION';
export const ntGetNotification = () => {
  return {
    type: NT_GET_NOTIFICATION,
  };
};

export const NT_SET_NOTIFICATION = 'NT_SET_NOTIFICATION';
export const ntSetNotification = notification => {
  return {
    type: NT_SET_NOTIFICATION,
    notification,
  };
};

export const NT_SET_NOTIFICATION_GEN = 'NT_SET_NOTIFICATION_GEN';
export const ntSetNotificationGen = notification => {
  return {
    type: NT_SET_NOTIFICATION_GEN,
    notification,
  };
};

export const NT_SET_NOTIFICATION_SYS = 'NT_SET_NOTIFICATION_SYS';
export const ntSetNotificationSys = notification => {
  return {
    type: NT_SET_NOTIFICATION_SYS,
    notification,
  };
};

export const NT_PRORESS_NOTIFICATION = 'NT_PRORESS_NOTIFICATION';
export const ntProcessNotification = notification => {
  return {
    type: NT_PRORESS_NOTIFICATION,
    notification,
  };
};

export const NT_RECEIVE_NOTI = 'NT_RECEIVE_NOTI';
export const ntReceiveNoti = () => {
  return {
    type: NT_RECEIVE_NOTI,
  };
};

export const NT_SET_COUNT_NOTI_TAB = 'NT_SET_COUNT_NOTI_TAB';
export const ntSetCountNotiTab = count => {
  return {
    type: NT_SET_COUNT_NOTI_TAB,
    count,
  };
};

export const NT_RESET_COUNT_NOTI_TAB = 'NT_RESET_COUNT_NOTI_TAB';
export const ntResetCountNotiTab = () => {
  return {
    type: NT_RESET_COUNT_NOTI_TAB,
  };
};
