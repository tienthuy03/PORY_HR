import {
  FETCH_LANGUAGE,
  FETCH_LANGUAGE_SUCCESS,
  FETCH_LANGUAGE_FAILED,
  DELETE_LANGUAGE,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const languageReducer = (language = initData, action) => {
  switch (action.type) {
    case FETCH_LANGUAGE:
      return {
        ...language,
        isLoading: true,
      };
    case FETCH_LANGUAGE_SUCCESS:
      return {
        ...language,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_LANGUAGE_FAILED:
      return {
        ...language,
        data: {},
        isLoading: false,
        error: 'Fetch language fail',
      };
    case DELETE_LANGUAGE:
      return initData;

    default:
      return language;
  }
};

export default languageReducer;
