import * as action from './action';
const initialState = {
  receiveNotification: 'Y',
  theme: null,
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.SYS_LOAD_THEME:
      return {
        ...state,
        theme: act.theme,
      };
    case action.SET_RECEIVE_NOTIFICATION:
      return {
        ...state,
        receiveNotification: act.recieveNotification,
      };
    case action.LOAD_RECEIVE_NOTIFICATION:
      return {
        ...state,
        receiveNotification: act.recieveNotification,
      };
    default:
      return state;
  }
};
export default reducer;
