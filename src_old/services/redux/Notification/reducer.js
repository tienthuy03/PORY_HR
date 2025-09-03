import {
  NT_SET_COUNT_NOTI_TAB,
  NT_SET_NOTIFICATION,
  NT_SET_NOTIFICATION_GEN,
  NT_SET_NOTIFICATION_SYS,
} from './action';

const initialState = {
  notification: [],
  image: [],
  notificationGen: [],
  notificationSys: [],
  countNotiTab: '0-0',
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NT_SET_COUNT_NOTI_TAB: {
      return {
        ...state,
        countNotiTab: action.count,
      };
    }

    case NT_SET_NOTIFICATION_GEN:
      return {
        ...state,
        notificationGen: action.notification,
      };
    case NT_SET_NOTIFICATION_SYS:
      return {
        ...state,
        notificationSys: action.notification,
      };
    case NT_SET_NOTIFICATION:
      return {
        ...state,
        notification: action.notification.notification,
        image: action.notification.image,
      };
    default:
      return state;
  }
};

export default notificationReducer;
