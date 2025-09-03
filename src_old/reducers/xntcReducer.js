import {
  FETCH_XNTC,
  FETCH_XNTC_SUCCESS,
  FETCH_XNTC_FAILED,
  POST_XNTC,
  DELETE_XNTC
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const xntcReducer = (xntc = initData, action) => {
  switch (action.type) {
    case FETCH_XNTC:
      return {
        ...xntc,
        isLoading: true,
      };
    case FETCH_XNTC_SUCCESS:
      return {
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_XNTC_FAILED:
      return {
        ...xntc,
        data: {},
        isLoading: false,
        error: 'Fetch xntc fail',
      };
      case DELETE_XNTC:
        return initData;

    default:
      return xntc;
  }
};

export default xntcReducer;
