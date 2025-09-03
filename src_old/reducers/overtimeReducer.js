import {
  FETCH_PD_TC,
  FETCH_PDTC_SUCCESS,
  FETCH_PDTC_FAILED,
  DELETE_PDTC,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const overtimeReducer = (overtime = initData, action) => {
  switch (action.type) {
    case FETCH_PD_TC:
      return {
        ...overtime,
        isLoading: true,
      };
    case FETCH_PDTC_SUCCESS:
      return {
        ...overtime,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_PDTC_FAILED:
      return {
        ...overtime,
        data: {},
        isLoading: false,
        error: 'Fetch overtime fail',
      };
      case DELETE_PDTC:
        return initData;

    default:
      return overtime;
  }
};

export default overtimeReducer;
