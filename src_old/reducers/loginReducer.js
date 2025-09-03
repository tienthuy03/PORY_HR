import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  CLEAR_USER,
} from '../actions/actionType';
const initData = {
  data: {},
  user_name: '',
  isLoading: false,
  error: '',
};
const loginReducers = (user = initData, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...user,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...user,
        isLoading: false,
        data: action.payload,
        user_name: action.username,
        pass_word: action.password,
        error: 'no',
      };
    case LOGIN_FAILED:
      return {
        ...user,
        isLoading: false,
        data: action.payload,
        error: 'Login fail',
      };
    case UPDATE_USER:
      return {
        ...user,
        data: {
          ...user.data,
          data: {
            ...user.data.data,
            [action.payload.key]: action.payload.value,
          },
          // ...Object.entries(user.data.data).slice(action.payload.index + 1),
        },
      };
    case CLEAR_USER:
      return initData;
    default:
      return user;
  }
};

export default loginReducers;
