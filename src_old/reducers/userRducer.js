import {
  GET_INFOR,
  GET_MENU_HRIN,
  GET_MENU_HRRE,
  GET_MENU_HRAP,
  GET_MENU_HRTI,
  GET_MENU_HRTK,
  GET_MENU_HRDT,
  GET_LANGUGE,
  ADD_LANGUGE,
  CHANGE_LANGUGE,
  GET_MENU,
  GET_MENU_HRMN,
  GET_USERNAME,
  GET_PASS,
  GET_STATUS,
  GET_VALUE_AUTHEN,
  GET_FINGER,
} from '../actions';
const initialState = {
  itemList: [],
  userName: '',
  password: '',
  status: false,
  valueAuthen: '',
  finger: '',
};
const stateMenu = {
  menu_total: [],
  menu_HRIN: [],
  menu_HRRE: [],
  menu_HRAP: [],
  menu_HRTI: [],
  menu_HRTK: [],
  menu_HRDT: [],
  menu_HRMN: [],
};

const stateLanguage = {
  arr_Language: [],
};
const userLanguagesss = {
  userlanguage: '',
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INFOR:
      return {
        ...state,
        itemList: action.payload,
      };
    case GET_USERNAME:
      return {
        ...state,
        userName: action.payload,
      };
    case GET_PASS:
      return {
        ...state,
        password: action.payload,
      };
    case GET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case GET_VALUE_AUTHEN:
      return {
        ...state,
        valueAuthen: action.payload,
      };
    case GET_FINGER:
      return {
        ...state,
        finger: action.payload,
      };
    default:
      return state;
  }
};

export const rootMenu = (menu = stateMenu, action) => {
  switch (action.type) {
    case GET_MENU_HRIN:
      return {
        ...menu,
        menu_HRIN: action.payload,
      };
    case GET_MENU_HRRE:
      return {
        ...menu,
        menu_HRRE: action.payload,
      };
    case GET_MENU_HRAP:
      return {
        ...menu,
        menu_HRAP: action.payload,
      };
    case GET_MENU_HRTI:
      return {
        ...menu,
        menu_HRTI: action.payload,
      };
    case GET_MENU_HRTK:
      return {
        ...menu,
        menu_HRTK: action.payload,
      };
    case GET_MENU_HRDT:
      return {
        ...menu,
        menu_HRDT: action.payload,
      };
    case GET_MENU_HRMN:
      return {
        ...menu,
        menu_HRMN: action.payload,
      };

    case GET_MENU:
      return {
        ...menu,
        menu_total: action.payload,
      };
    default:
      return menu;
  }
};

export const rootLanguage = (arr = stateLanguage, action) => {
  switch (action.type) {
    case GET_LANGUGE:
      return {
        ...arr,
        arr_Language: action.payload,
      };
    default:
      return arr;
  }
};

export const rootUserLanguage = (arr = userLanguagesss, action) => {
  switch (action.type) {
    case ADD_LANGUGE:
      return {
        ...arr,
        userlanguage: action.payload,
      };
    default:
      return arr;
  }
};
