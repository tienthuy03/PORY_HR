import {
  FETCH_MENU,
  FETCH_MENU_SUCCESS,
  FETCH_MENU_FAILED,
  DELETE_MENU,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const menuReducer = (menu = initData, action) => {
  switch (action.type) {
    case FETCH_MENU:
      return {
        ...menu,
        isLoading: true,
      };
    case FETCH_MENU_SUCCESS:
      return {
        ...menu,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_MENU_FAILED:
      return {
        ...menu,
        data: {},
        isLoading: false,
        error: 'Fetch menu fail',
      };
      case DELETE_MENU:
        return initData;

    default:
      return menu;
  }
};

export default menuReducer;
